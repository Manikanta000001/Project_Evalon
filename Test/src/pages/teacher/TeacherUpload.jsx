import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from "axios";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Moon, 
  Sun, 
  ChevronDown,
  X
} from 'lucide-react';

const TeacherUpload = () => {
  // Theme State
    
  
    const { dark: isDarkMode } = useOutletContext() || {};

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    regulation: '',
    subject: '',
    department: '',
    year: ''
  });
  
  // File State
  const [file, setFile] = useState(null);
  const [parsingStatus, setParsingStatus] = useState('idle'); // idle, parsing, success, error
  const [isUploaded, setIsUploaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  // Constants
  const regulations = ['R21', 'R22'];
  const subjectsMap = {
    'R21': ['Android Development', 'Web Development'],
    'R22': ['Machine Learning', 'Cloud Computing', 'Data Structures']
  };
  const departments = ['CSE', 'ECE', 'ME', 'CH', 'IT', 'EEE'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // Handle Form Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormError(''); // Clear error on change
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subject if regulation changes
      ...(name === 'regulation' ? { subject: '' } : {})
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.doc') || selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile);
        setParsingStatus('idle');
        setIsUploaded(false);
        setFormError('');
      } else {
        setFormError("Please upload a valid .doc or .docx file");
        e.target.value = null;
      }
    }
  };

  const validateForm = () => {
    const isFieldsComplete = (
      formData.title.trim() !== '' &&
      formData.regulation !== '' &&
      formData.subject !== '' &&
      formData.department !== '' &&
      formData.year !== ''
    );
    return isFieldsComplete;
  };

const handleParse = async () => {
  if (!validateForm()) {
    setFormError("All fields must be filled before parsing the document.");
    setParsingStatus("error");
    return;
  }

  if (!file) {
    setFormError("Please upload a document first.");
    return;
  }

  try {
    setParsingStatus("parsing");
    setFormError("");

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    const response = await axios.post(
      "http://127.0.0.1:8000/process",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Parsing response:", response.data);

    // If Python returns success flag
    if (!response.data.error) {
      setParsingStatus("success");
    } else {
      setParsingStatus("error");
      setFormError("Parsing failed: Structure not valid.");
    }

  } catch (error) {
    console.error("Parsing error:", error);
    setParsingStatus("error");
    setFormError("Parsing service unavailable.");
  }
};

const handleUpload = async () => {
  try {
    setParsingStatus("parsing");

    const token = JSON.parse(localStorage.getItem("userdata"))?.token;

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("year", formData.year);
    formDataToSend.append("file", file); // IMPORTANT: backend expects "file"

    const response = await axios.post(
     `${import.meta.env.VITE_API_URL}/api/question-banks/upload`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Upload success:", response.data);

    setParsingStatus("success");
    setIsUploaded(true);
    setShowToast(true);

    // Reset form after success
    setTimeout(() => {
      setShowToast(false);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setFormData({
        title: "",
        regulation: "",
        subject: "",
        department: "",
        year: "",
      });

      setParsingStatus("idle");
    }, 2500);

  } catch (error) {
    console.error("Upload failed:", error);
    setParsingStatus("error");
    setFormError("Upload failed. Please try again.");
  }
};

  return (<>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up { animation: slideInUp 0.5s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-in forwards; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .input-focus-effect:focus-within { transform: translateY(-2px); transition: all 0.3s ease; }
      `}</style>


      <main className="max-w-1xl mx-auto p-6">
        <div className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-slide-up ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}>
          <div className="bg-blue-600 p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold">Submit Document</h2>
              <p className="opacity-80 text-sm mt-1">Fill in the details below to parse and upload your academic records.</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileText size={120} className="rotate-12" />
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-1">
              
              <div className="space-y-2 input-focus-effect">
                <label className="text-sm font-medium opacity-70">Document Title</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Lab Report 1"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-2 input-focus-effect">
                <label className="text-sm font-medium opacity-70">Department</label>
                <div className="relative">
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full appearance-none px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 input-focus-effect">
                <label className="text-sm font-medium opacity-70">Regulation</label>
                <div className="relative">
                  <select 
                    name="regulation"
                    value={formData.regulation}
                    onChange={handleInputChange}
                    className={`w-full appearance-none px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="">Select Regulation</option>
                    {regulations.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 input-focus-effect">
                <label className="text-sm font-medium opacity-70">Subject</label>
                <div className="relative">
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={!formData.regulation}
                    className={`w-full appearance-none px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 ${
                      !formData.regulation ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="">Select Subject</option>
                    {formData.regulation && subjectsMap[formData.regulation].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 input-focus-effect">
                <label className="text-sm font-medium opacity-70">Year</label>
                <div className="relative">
                  <select 
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`w-full appearance-none px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="">Select Academic Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-3 stagger-2">
              <label className="text-sm font-medium opacity-70">Document Attachment (.doc, .docx)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-500 transform hover:scale-[1.01] hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                  file ? 'border-blue-500 bg-blue-50/10' : 'border-slate-300 hover:border-blue-400'
                } ${isDarkMode ? 'border-slate-600' : ''}`}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept=".doc,.docx"
                  onChange={handleFileChange}
                />
                
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                    file ? 'bg-blue-600 text-white scale-110 rotate-12 shadow-lg' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Upload size={24} />
                  </div>
                  {file ? (
                    <div className="space-y-1 animate-scale-in">
                      <p className="font-semibold text-blue-600">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <p className="font-medium">Click to browse or drag and drop</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Supported: DOC, DOCX only</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message Display */}
            {formError && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 animate-scale-in">
                <AlertCircle size={20} className="animate-pulse" />
                <p className="text-sm font-medium">{formError}</p>
              </div>
            )}

            {/* Action Buttons & Status */}
            <div className="flex flex-col items-center gap-4 pt-4 min-h-[80px] stagger-3">
              {/* Parse button only appears if file is provided */}
              {file && parsingStatus === 'idle' && (
                <button 
                  onClick={handleParse}
                  className="w-full md:w-64 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 animate-scale-in flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  Parse Document
                </button>
              )}

              {parsingStatus === 'parsing' && (
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-blue-600 font-medium animate-pulse">Analyzing content...</p>
                </div>
              )}

              {parsingStatus === 'success' && (
                <div className="w-full flex flex-col items-center gap-4 animate-scale-in">
                  <div className="flex items-center gap-2 text-green-500 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-900/30">
                    <CheckCircle size={18} className="animate-bounce" />
                    <span className="font-medium">Parsing successful!</span>
                  </div>
                  <button 
                    onClick={handleUpload}
                    className="w-full md:w-64 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    Upload Files
                  </button>
                </div>
              )}

              {parsingStatus === 'error' && (
                <div className="w-full flex flex-col items-center gap-4 animate-scale-in">
                  <button 
                    onClick={handleParse}
                    className="w-full md:w-64 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold py-3 rounded-lg transition-all active:scale-95"
                  >
                    Retry Parsing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-50 animate-scale-in">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
              <CheckCircle size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold leading-tight">Uploaded successfully</p>
              <p className="text-xs text-slate-400">Your record has been stored.</p>
            </div>
            <button 
              onClick={() => setShowToast(false)} 
              className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
  </>
  );
};

export default TeacherUpload;