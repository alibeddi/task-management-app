import { useState } from "react";
import "./Header.css";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <h1 className="list-title"> Task management</h1>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear search">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.7309 18.3109L16.0209 14.6309C17.461 12.8353 18.1584 10.5562 17.9697 8.2622C17.781 5.9682 16.7206 3.83368 15.0064 2.29754C13.2923 0.761407 11.0547 -0.0595894 8.75382 0.00337096C6.45294 0.0663314 4.26362 1.00846 2.63604 2.63604C1.00846 4.26362 0.0663314 6.45294 0.00337096 8.75382C-0.0595894 11.0547 0.761407 13.2923 2.29754 15.0064C3.83368 16.7206 5.9682 17.781 8.2622 17.9697C10.5562 18.1584 12.8353 17.461 14.6309 16.0209L18.3109 19.7009C18.4039 19.7946 18.5145 19.869 18.6363 19.9198C18.7582 19.9706 18.8889 19.9967 19.0209 19.9967C19.1529 19.9967 19.2836 19.9706 19.4055 19.9198C19.5273 19.869 19.6379 19.7946 19.7309 19.7009C19.9111 19.5144 20.0119 19.2652 20.0119 19.0059C20.0119 18.7466 19.9111 18.4974 19.7309 18.3109ZM9.0209 16.0209C7.63643 16.0209 6.28305 15.6104 5.13191 14.8412C3.98076 14.072 3.08356 12.9788 2.55374 11.6997C2.02393 10.4206 1.88531 9.01314 2.1554 7.65527C2.4255 6.2974 3.09219 5.05012 4.07115 4.07115C5.05012 3.09219 6.2974 2.4255 7.65527 2.1554C9.01314 1.88531 10.4206 2.02393 11.6997 2.55374C12.9788 3.08356 14.072 3.98076 14.8412 5.13191C15.6104 6.28305 16.0209 7.63643 16.0209 9.0209C16.0209 10.8774 15.2834 12.6579 13.9706 13.9706C12.6579 15.2834 10.8774 16.0209 9.0209 16.0209Z"
                fill="#94A2BC"
              />
            </svg>
          </div>
        </div>

        <div className="header-actions">
          <button className="notification-btn" aria-label="Notifications">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 18.0233C21 18.5113 20.6043 18.907 20.1163 18.907H3.88372C3.39565 18.907 3 18.5113 3 18.0233C3 17.5352 3.39566 17.1395 3.88372 17.1395H3.9V10.9809C3.9 6.57288 7.527 3 12 3C16.473 3 20.1 6.57288 20.1 10.9809V17.1395H20.1163C20.6043 17.1395 21 17.5352 21 18.0233ZM5.7 17.1395H18.3V10.9809C18.3 7.5494 15.4794 4.76744 12 4.76744C8.5206 4.76744 5.7 7.5494 5.7 10.9809V17.1395ZM9.97604 20.7558C9.73121 20.2608 10.1977 19.7907 10.75 19.7907H13.25C13.8023 19.7907 14.2688 20.2608 14.024 20.7558C13.9155 20.9751 13.7699 21.1773 13.591 21.3529C13.169 21.7672 12.5967 22 12 22C11.4033 22 10.831 21.7672 10.409 21.3529C10.2301 21.1773 10.0845 20.9751 9.97604 20.7558Z"
                fill="#768396"
              />
              <circle cx="18.5" cy="5.5" r="5.5" fill="#5150F9" />
              <text
                fill="white"
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
                fontFamily="DM Sans"
                fontSize="8"
                fontWeight="bold"
                letterSpacing="0em">
                <tspan x="16" y="7.728">
                  2
                </tspan>
              </text>
            </svg>
          </button>

          <div className="user-profile-container">
            <button
              className="user-profile"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="User menu"
              aria-expanded={isProfileMenuOpen}>
              <img src="" alt="User" className="profile-image" />
              <svg
                className={`dropdown-arrow ${isProfileMenuOpen ? "open" : ""}`}
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.42 6.3708L11.07 0.7108C11.1637 0.617803 11.2381 0.507202 11.2889 0.385397C11.3396 0.263536 11.3658 0.132843 11.3658 0.000843048C11.3658 -0.131157 11.3396 -0.26185 11.2889 -0.383711C11.2381 -0.505516 11.1637 -0.616117 11.07 -0.709114C10.8826 -0.895462 10.6292 -1 10.365 -1C10.1008 -1 9.84726 -0.895462 9.66 -0.709114L4.66 4.2408L-0.29 -0.709114C-0.477403 -0.895462 -0.730848 -1 -0.995 -1C-1.25915 -1 -1.5126 -0.895462 -1.7 -0.709114C-1.79446 -0.616585 -1.86969 -0.506945 -1.92044 -0.385708C-1.97119 -0.264471 -1.99644 -0.133504 -2 -0.000843048C-1.99644 0.131817 -1.97119 0.262784 -1.92044 0.384021C-1.86969 0.505258 -1.79446 0.614898 -1.7 0.707428L4.95 6.3674C5.04365 6.46892 5.15729 6.55327 5.2838 6.60871C5.41031 6.66414 5.54693 6.69269 5.685 6.69269C5.82307 6.69269 5.95969 6.66414 6.0862 6.60871C6.21271 6.55327 6.32635 6.46892 6.42 6.3674L5.42 6.3708Z"
                  fill="#5250F9"
                />
              </svg>
            </button>

            {isProfileMenuOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <img src="" alt="User" className="profile-avatar" />
                  <div className="profile-details">
                    <h4>Ali Beddi</h4>
                    <p>ali.beddi@example.com</p>
                  </div>
                </div>
                <div className="profile-menu">
                  <button className="menu-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile
                  </button>
                  <button className="menu-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                    </svg>
                    Settings
                  </button>
                  <button className="menu-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16,17 21,12 16,7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
