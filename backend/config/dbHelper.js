const { getFallbackData, saveFallbackData, isMongoConnected } = require('./fallbackDB');

// Helper to check MongoDB connection and run operation or use fallback
const dbHelper = {
  find: async (Model, filename, filter = {}, sort = null) => {
    if (isMongoConnected()) {
      try {
        let query = Model.find(filter);
        if (sort) {
          query = query.sort(sort);
        }
        return await query;
      } catch (err) {
        console.error(`MongoDB find error, falling back to local file ${filename}:`, err.message);
      }
    }
    
    // Fallback to local files
    let data = getFallbackData(filename);
    
    // Apply filter (simple equality matching)
    if (Object.keys(filter).length > 0) {
      data = data.filter(item => {
        return Object.entries(filter).every(([key, val]) => {
          return item[key] === val;
        });
      });
    }
    
    // Apply sort (simple sorting by field desc/asc)
    if (sort) {
      const [field, direction] = Object.entries(sort)[0];
      data.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        
        // Handle dates
        if (field === 'date') {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        
        if (direction === -1 || direction === 'desc') {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        } else {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        }
      });
    }
    
    return data;
  },

  findOne: async (Model, filename, filter = {}) => {
    if (isMongoConnected()) {
      try {
        return await Model.findOne(filter);
      } catch (err) {
        console.error(`MongoDB findOne error, falling back to local file ${filename}:`, err.message);
      }
    }
    
    const data = getFallbackData(filename);
    return data.find(item => {
      return Object.entries(filter).every(([key, val]) => {
        return item[key] === val;
      });
    }) || null;
  },

  save: async (Model, filename, idField, matchVal, itemData) => {
    if (isMongoConnected()) {
      try {
        let doc = await Model.findOne({ [idField]: matchVal });
        if (doc) {
          Object.assign(doc, itemData);
          await doc.save();
          return doc;
        } else {
          doc = new Model(itemData);
          await doc.save();
          return doc;
        }
      } catch (err) {
        console.error(`MongoDB save error, falling back to local file ${filename}:`, err.message);
      }
    }
    
    // Fallback to local files
    const data = getFallbackData(filename);
    const idx = data.findIndex(item => item[idField] === matchVal);
    
    const newDoc = { ...itemData };
    if (!newDoc[idField]) {
      newDoc[idField] = matchVal;
    }
    
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...newDoc };
    } else {
      data.push(newDoc);
    }
    
    saveFallbackData(filename, data);
    return newDoc;
  },

  deleteOne: async (Model, filename, idField, matchVal) => {
    if (isMongoConnected()) {
      try {
        const doc = await Model.findOne({ [idField]: matchVal });
        if (doc) {
          await Model.deleteOne({ [idField]: matchVal });
          return true;
        }
        return false;
      } catch (err) {
        console.error(`MongoDB deleteOne error, falling back to local file ${filename}:`, err.message);
      }
    }
    
    // Fallback to local files
    const data = getFallbackData(filename);
    const idx = data.findIndex(item => item[idField] === matchVal);
    if (idx !== -1) {
      data.splice(idx, 1);
      saveFallbackData(filename, data);
      return true;
    }
    return false;
  }
};

module.exports = dbHelper;
