import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaComments, FaPaperPlane, FaTimes, FaPhoneAlt, FaRobot, FaPalette } from 'react-icons/fa';
import productsData from '../../data/products.json';
import servicesData from '../../data/services.json';

export default function FloatingWidgets() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWaOpen, setIsWaOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('orange');

  const themes = {
    orange: {
      name: "Safety Orange",
      color: "#EA580C",
      variables: {
        '--color-industrial-primary': '#F97316',
        '--color-industrial-cyan': '#EA580C'
      }
    },
    gold: {
      name: "Royal Gold",
      color: "#B45309",
      variables: {
        '--color-industrial-primary': '#D97706',
        '--color-industrial-cyan': '#B45309'
      }
    },
    blue: {
      name: "Electric Blue",
      color: "#0284C7",
      variables: {
        '--color-industrial-primary': '#0EA5E9',
        '--color-industrial-cyan': '#0284C7'
      }
    },
    green: {
      name: "Forest Green",
      color: "#15803D",
      variables: {
        '--color-industrial-primary': '#16A34A',
        '--color-industrial-cyan': '#15803D'
      }
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('company-theme');
    if (savedTheme && themes[savedTheme]) {
      setActiveTheme(savedTheme);
      const vars = themes[savedTheme].variables;
      Object.keys(vars).forEach(key => {
        document.documentElement.style.setProperty(key, vars[key]);
      });
    }
  }, []);

  const applyTheme = (themeKey) => {
    setActiveTheme(themeKey);
    localStorage.setItem('company-theme', themeKey);
    const vars = themes[themeKey].variables;
    Object.keys(vars).forEach(key => {
      document.documentElement.style.setProperty(key, vars[key]);
    });
  };

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Anand Electricals assistant. How can I help you today? You can ask me about our industrial panels, services, company history, owner, or how to get a quote.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  const primaryPhone = '+917689057259';
  const whatsappMessage = 'Hello Anand Electricals, I would like to inquire about your industrial electrical panels and contracting services.';

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate typing indicator
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = generateBotReply(textToSend);
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600); // 0.8s to 1.4s delay
  };

  const generateBotReply = (query) => {
    const q = query.toLowerCase().trim();

    // 1. GREETINGS (loose search for hi, hello, hey, namaste, ram ram, sup, etc.)
    if (q.match(/\b(hi+|hello+|hey+|helo+|hola+|namaste+|ram\s*ram+|greetings|good\s*(morning|afternoon|evening))\b/) || q === 'hi' || q === 'hii' || q === 'hiii' || q === 'hey' || q.includes('assistant')) {
      const responses = [
        "Hello! I am your Anand Electricals assistant. How can I help you today? You can ask me about our industrial panels, services, company history, owner, or how to get a quote.",
        "Hi there! Nice to connect with you. How can we support your electrical infrastructure today?",
        "Namaste! Welcome to Anand Electricals. How can I assist you with panels, earthing, or substation installations today?",
        "Hello! Need help with panels, engineering services, or contracting coordinates? Ask me anything!"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // 2. CASUAL TALK / WELLBEING
    if (q.includes("how are you") || q.includes("how r u") || q.includes("kya haal") || q.includes("kese ho") || q.includes("kaise ho") || q.includes("fine") || q.includes("sab badhiya")) {
      return "I'm doing great, thank you for asking! I'm here and ready to help you with anything related to Anand Electricals & Engineers. What can I help you explore?";
    }

    // 3. THANKS / BYE
    if (q.match(/\b(thank|thanks|dhanyawad|shukriya|nice|good|great|awesome|ok|okay|bye|tata)\b/)) {
      return "Awesome! Let me know if you want to know about our **products**, **services**, **Jaipur HQ location**, or how to get a **quote**. I'm here if you need anything else!";
    }

    // 4. OWNER / DIRECTOR / FOUNDER / AMIT (loose Hinglish support: 'kaun', 'malik', 'owner', 'founder')
    if (q.match(/\b(owner|director|founder|boss|head|amit|kumar|malik|proprietor|ceo|md)\b/) || q.includes("kaun hai") || q.includes("kon hai") || q.includes("kiski hai")) {
      const bio = "Anand Electricals is founded and led by **Amit Kumar** (Managing Director & Founder). He has over 18 years of hands-on expertise in high-voltage industrial engineering, switchgear designs, and grid commissioning. Under his leadership, the firm has delivered massive multi-crore infrastructure installations across RIICO industrial hubs in Rajasthan.";
      return `Amit Kumar is the Founder & Managing Director of Anand Electricals. He oversees all engineering and substation operations here in Jaipur.\n\n${bio}\n\nYou can view more details on our [Leadership page](/leadership).`;
    }

    // 5. ADDRESS / LOCATION / JAIPUR (loose matches)
    if (q.match(/\b(address|location|office|where|kahan|kaha|address|factory|plant|jaipur|rajasthan|map|sarna|ranisati)\b/)) {
      return `Our corporate office and advanced manufacturing facility are located at:\n**S.No. 5, Near Ranisati Dharmkanta, Sarna Industrial Area, Jaipur, Rajasthan - 302012**.\n\nWe operate Monday to Saturday from 9:00 AM to 7:30 PM. You can find our directions on the [Contact Us page](/contact).`;
    }

    // 6. CONTACT / PHONE / EMAIL (loose matches: 'number', 'mobile', 'call', 'email', 'mail', 'phone')
    if (q.match(/\b(phone|number|contact|call|email|mail|address|support|whatsapp|no\.|no)\b/) || q.includes("phone number") || q.includes("email id") || q.includes("mail id") || q.includes("gmail") || q.includes("g-mail")) {
      return `Here are our contact coordinates:\n• **Phone Numbers**: +91 7689057259 / +91 9001347691\n• **Email Address**: anandelectricalsoffice@gmail.com\n• **Office Address**: Sarna Industrial Area, Jaipur.\n\nAlternatively, you can submit an instant inquiry using our online form on the [Contact page](/contact).`;
    }

    // 7. SPECIFIC PANEL SEARCH (loose lookup for products in the query)
    let matchedProd = null;
    if (q.includes("apfc") || q.includes("power factor") || q.includes("capacitor")) matchedProd = productsData.find(p => p.id === 'apfc-panel');
    else if (q.includes("dg") || q.includes("generator") || q.includes("diesel")) matchedProd = productsData.find(p => p.id === 'dg-set-panel');
    else if (q.includes("ht") || q.includes("lt") || q.includes("high tension") || q.includes("low tension")) matchedProd = productsData.find(p => p.id === 'ht-lt-panel');
    else if (q.includes("transformer")) matchedProd = productsData.find(p => p.id === 'transformers');
    else if (q.includes("cable") || q.includes("wire") || q.includes("polycab") || q.includes("havells")) matchedProd = productsData.find(p => p.id === 'wire-cables');
    else if (q.includes("earthing") || q.includes("grounding") || q.includes("chemical")) matchedProd = productsData.find(p => p.id === 'chemical-earthing');
    else if (q.includes("mcc") || q.includes("motor control")) matchedProd = productsData.find(p => p.id === 'motor-control-center');
    else if (q.includes("pcc") || q.includes("power control")) matchedProd = productsData.find(p => p.id === 'power-control-center');
    else if (q.includes("vcb") || q.includes("vacuum circuit")) matchedProd = productsData.find(p => p.id === 'vcb-panel');
    else if (q.includes("acb") || q.includes("air circuit")) matchedProd = productsData.find(p => p.id === 'acb-panel');
    else if (q.includes("fire") || q.includes("hydrant")) matchedProd = productsData.find(p => p.id === 'fire-hydrant-panel');

    if (matchedProd) {
      const specsStr = matchedProd.specs.map(s => `• **${s.name}**: ${s.value}`).join('\n');
      const featuresStr = matchedProd.features.map(f => `• ${f}`).join('\n');
      return `### **${matchedProd.name}**\n${matchedProd.description}\n\n**Technical Specifications:**\n${specsStr}\n\n**Key Features:**\n${featuresStr}\n\nWould you like to request a layout quote? Check the [${matchedProd.name} Specs page](/products/${matchedProd.slug}) or go to our [Quote page](/quote).`;
    }

    // 8. GENERAL PRODUCTS / CATALOG / ITEMS (loose matches: 'product', 'panels', 'make', 'banate', 'dikhao')
    if (q.includes("product") || q.includes("panel") || q.includes("item") || q.includes("catalog") || q.includes("list") || q.includes("banate") || q.includes("dikhao") || q.includes("kya kya") || q.includes("material")) {
      const pList = productsData.slice(0, 8).map(p => `• **${p.name}** [Specs](/products/${p.slug})`).join('\n');
      return `We manufacture high-grade industrial panels and electrical systems. Here are some of our popular fabrications:\n${pList}\n\nWe offer a total of 14 product lines. You can explore all of them on our [Products page](/products)!`;
    }

    // 9. SERVICES / AMC (loose matches: 'service', 'amc', 'kaam', 'maintenance', 'install')
    if (q.includes("service") || q.includes("amc") || q.includes("maintenance") || q.includes("install") || q.includes("contracting") || q.includes("audit") || q.includes("kaam")) {
      const sList = servicesData.map(s => `• **${s.title}** - ${s.description}`).join('\n');
      return `We provide professional industrial contracting and annual maintenance services. Here is what we offer:\n${sList}\n\nYou can read details or request help on our [Services page](/services).`;
    }

    // 10. PROJECTS / PORTFOLIO / CLIENTS (loose matches: 'project', 'experience', 'client', 'work')
    if (q.includes("project") || q.includes("client") || q.includes("work") || q.includes("portfolio") || q.includes("experience") || q.includes("test")) {
      return `Over the past 18 years, Anand Electricals has completed **515+ industrial projects** for over **400+ happy clients**. Some of our clients include Sun Agri Science, BSB Steel, Saint Teresa's School, and Max Healthcare. Explore our detailed case studies on our [Projects page](/projects).`;
    }

    // 11. CAREERS / JOBS (loose matches: 'job', 'careers', 'hiring', 'resume', 'apply')
    if (q.includes("job") || q.includes("career") || q.includes("hiring") || q.includes("vacancy") || q.includes("apply") || q.includes("resume") || q.includes("naukri") || q.includes("cv")) {
      return `We are currently hiring! We have active openings for:\n1. **Senior Electrical Commissioning Engineer**\n2. **Estimation & Proposals Engineer**\n\nYou can read requirements and submit your resume directly on our [Careers page](/careers).`;
    }

    // 12. QUOTE / PRICE / COST (loose matches: 'quote', 'price', 'cost', 'rate', 'price list', 'tender')
    if (q.match(/\b(quote|price|cost|rate|estimation|tender|commercial|sld|bom|kitna|paisay)\b/) || q.includes("price list") || q.includes("rate card")) {
      return `To prepare a commercial estimate or a Bill of Materials (BOM) matching your single-line diagram (SLD), please fill out our technical quote request form. Head over to our [Quote page](/quote) to submit your details. Estimations are typically delivered in 24 to 48 working hours.`;
    }

    // Fallback conversational responder
    return `I see you are asking about something interesting! I can help you with:\n• Finding **product specs** (e.g. APFC Panel, DG Set Panel, Transformers)\n• Information about our owner (**Amit Kumar**)\n• Our **Jaipur factory location** and contact numbers\n• How to get a **commercial quote** or find **jobs**\n\nWhat would you like to know more about? You can also call us directly at **+91 7689057259**!`;
  };

  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  const formatText = (text) => {
    return text.split('\n').map((line, key) => {
      // Handle bold Markdown format **text**
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Handle links [text](/url)
      formattedLine = formattedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-industrial-cyan hover:underline font-semibold">$1</a>');

      if (line.startsWith('•')) {
        return (
          <li key={key} className="list-disc ml-5 mt-1" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^•\s*/, '') }} />
        );
      }
      if (line.startsWith('###')) {
        return (
          <h4 key={key} className="font-heading font-bold text-slate-900 mt-3 mb-1" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^###\s*/, '') }} />
        );
      }
      return (
        <p key={key} className="mt-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3.5 select-none">
      
      {/* 1. CHATBOT WINDOW */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-[360px] md:w-[380px] h-[500px] bg-white border border-slate-200/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-industrial-cyan to-[#0a0f18] text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <FaRobot className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm leading-none">Anand Assistant</h3>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close Chat"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={chatBodyRef} className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4 text-xs font-body">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-industrial-cyan text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-200/50 rounded-tl-none'
                  }`}>
                    {formatText(msg.text)}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

            </div>

            {/* Suggestion Chips */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/60 overflow-x-auto flex gap-2 no-scrollbar">
              <button 
                onClick={() => handleSuggestionClick("Who runs the company?")}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-industrial-cyan hover:border-industrial-cyan/30 rounded-full whitespace-nowrap transition-all"
              >
                Who is the owner?
              </button>
              <button 
                onClick={() => handleSuggestionClick("Show me your panel products")}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-industrial-cyan hover:border-industrial-cyan/30 rounded-full whitespace-nowrap transition-all"
              >
                Panel Products
              </button>
              <button 
                onClick={() => handleSuggestionClick("Where is Sarna facility located?")}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-industrial-cyan hover:border-industrial-cyan/30 rounded-full whitespace-nowrap transition-all"
              >
                Office Location
              </button>
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
              className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about products, owner, address..."
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:border-industrial-cyan text-slate-800"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-industrial-cyan hover:bg-[#0a0f18] text-white flex items-center justify-center shadow transition-colors flex-shrink-0"
                aria-label="Send Message"
              >
                <FaPaperPlane size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FLOATING ACTION WIDGETS TRIGGER ROW */}
      <div className="flex flex-col gap-3">
        {/* WhatsApp Floating Option Trigger */}
        <div className="relative">
          {/* Options Tooltip Panel */}
          <AnimatePresence>
            {isWaOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -15 }}
                className="absolute bottom-0 right-16 bg-white border border-slate-200/80 rounded-xl shadow-xl p-2.5 w-44 flex flex-col gap-1.5 z-50"
              >
                <a
                  href={`tel:${primaryPhone}`}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-industrial-cyan rounded-lg text-xs font-semibold font-heading transition-colors"
                >
                  <FaPhoneAlt className="text-industrial-cyan" />
                  <span>Call Office</span>
                </a>
                <div className="border-t border-slate-100 my-0.5"></div>
                <a
                  href={`https://wa.me/${primaryPhone.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-emerald-500 rounded-lg text-xs font-semibold font-heading transition-colors"
                >
                  <FaWhatsapp className="text-emerald-500 text-sm" />
                  <span>WhatsApp Chat</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Main Button */}
          <button
            onClick={() => { setIsWaOpen(!isWaOpen); setIsChatOpen(false); }}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
              isWaOpen ? 'bg-slate-900 hover:bg-slate-800 scale-105 animate-none' : 'bg-emerald-500 hover:bg-emerald-600 scale-100'
            }`}
            aria-label="WhatsApp and Phone Actions"
          >
            {isWaOpen ? <FaTimes size={20} /> : <FaWhatsapp size={24} />}
          </button>
        </div>

        {/* Theme Switcher Button */}
        <div className="relative">
          <AnimatePresence>
            {isThemeOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -15 }}
                className="absolute bottom-0 right-16 bg-white border border-slate-200/80 rounded-xl shadow-xl p-3 w-48 flex flex-col gap-2.5 z-50 text-xs font-heading font-semibold text-slate-800"
              >
                <div className="border-b border-slate-100 pb-2 text-[10px] uppercase tracking-wider text-slate-450">
                  Branding Accent
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(themes).map((key) => (
                    <button
                      key={key}
                      onClick={() => applyTheme(key)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        activeTheme === key ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: themes[key].color }}
                      title={themes[key].name}
                    />
                  ))}
                </div>
                <div className="text-[9px] text-slate-500 font-medium font-body leading-tight">
                  Click to preview brand combinations in real-time across the site.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => { setIsThemeOpen(!isThemeOpen); setIsChatOpen(false); setIsWaOpen(false); }}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
              isThemeOpen ? 'bg-slate-900 hover:bg-slate-800 scale-105' : 'bg-purple-600 hover:bg-purple-700 scale-100'
            }`}
            aria-label="Change Accent Color"
          >
            {isThemeOpen ? <FaTimes size={20} /> : <FaPalette size={20} />}
          </button>
        </div>

        {/* Chatbot Floating Button */}
        <button
          onClick={() => { setIsChatOpen(!isChatOpen); setIsWaOpen(false); setIsThemeOpen(false); }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
            isChatOpen ? 'bg-slate-900 hover:bg-slate-800 scale-105' : 'bg-industrial-cyan hover:bg-[#0a0f18] scale-100'
          }`}
          aria-label="Toggle Chatbot"
        >
          {isChatOpen ? <FaTimes size={20} /> : <FaComments size={22} />}
        </button>
      </div>

    </div>
  );
}
