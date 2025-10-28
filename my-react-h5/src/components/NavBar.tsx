import "@/assets/css/NavBar.css";

const NavBar = () => {
  return (
    <div className="nav-container">
      {/* 背景曲线 */}
      <svg
        className="nav-bg"
        viewBox="0 0 400 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="
            M0,20 
            Q0,0,20,0
            H135 
            C160,10 160,50 200,50   
            C250,50 240,0 270,0  
            H380
            Q400,0,400,20 
            V80 
            H0 
            Z"
          fill="#fff"
          stroke="#ddd"
        />
      </svg>

      {/* 中间按钮 */}
      <div className="center-btn">+</div>
    </div>
  );
};

export default NavBar;
