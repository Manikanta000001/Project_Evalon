const GlobalStyles = () => (
  <style>{`
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-submit-view {
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-zoom-fade {
      animation: zoomIn 0.5s ease-out forwards;
    }
  `}</style>
);

export default GlobalStyles;
