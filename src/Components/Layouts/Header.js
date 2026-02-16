import React, { useRef, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import HeaderLogo from '../../assets/images/logo.png';
import { AiFillHome, AiOutlineTeam, AiFillProject } from 'react-icons/ai';
import { useSelector, useDispatch } from "react-redux";
import { getCanbanProjects } from "../../redux/canban/canbanThunk";

const Header = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const sideBarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const handleOpen = () => setOpen((prev) => !prev);
  const handleSideBarOpen = () => setSideBarOpen((prev) => !prev);

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpen(false);
    }
    if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
      setSideBarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMenu = (title) => {
    if (title === "sign-out") {
      localStorage.clear();
      navigate("/login");
    }
    setOpen(false);
  };

  const dispatch = useDispatch();
  const projectsFromRedux = useSelector((state) => state.task.projects);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    dispatch(getCanbanProjects());
  }, [dispatch]);

  return (
    <>
      {/* Top Navigation */}
      <nav className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-md">
        <div className="px-3 py-3 lg:px-5 flex justify-between items-center">
          <button
            ref={sideBarRef}
            onClick={handleSideBarOpen}
            className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden bg-indigo-500"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              />
            </svg>
          </button>

          <div className="flex items-center">
            <button
              type="button"
              onClick={handleOpen}
              ref={wrapperRef}
              className="flex text-sm bg-gray-800 rounded-full p-1 focus:ring-2 focus:ring-blue-400"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="user"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* User Dropdown */}
      <div className={`fixed right-5 z-10 w-48 bg-white shadow-lg rounded-md py-1 ${open ? "" : "hidden"}`}>
        <Link
          to="/"
          onClick={() => handleMenu("profile")}
          className="block px-4 py-2 hover:bg-indigo-600 hover:text-white text-sm text-gray-700"
        >
          Your Profile
        </Link>
        <Link
          to="/login"
          onClick={() => handleMenu("sign-out")}
          className="block px-4 py-2 hover:bg-indigo-600 hover:text-white text-sm text-gray-700"
        >
          Sign out
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-56 h-screen transition-transform bg-white border-r border-gray-200 ${sideBarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <img src={HeaderLogo} className="h-14 w-20" alt="Logo" />
            <span className="ml-2 font-bold text-gray-700">Confluence</span>
          </Link>
          <button onClick={handleSideBarOpen} className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="px-3 py-4">
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/"
                className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-indigo-100 ${window.location.pathname === "/" ? "bg-indigo-200 font-semibold" : ""}`}
              >
                <AiFillHome className="text-lg" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/canban"
                className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-indigo-100 ${window.location.pathname === "/canban" ? "bg-indigo-200 font-semibold" : ""}`}
              >
                <AiOutlineTeam className="text-lg" />
                Canban Board
              </Link>
            </li>

            {/* Projects Dropdown */}
            <li className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AiFillProject className="text-lg text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Projects</span>
              </div>
              <select
                className="w-full px-2 py-2 border rounded text-sm border-gray-400"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">All Projects</option>
                {projectsFromRedux?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:ml-56">
        <Outlet />
      </div>
    </>
  );
};

export default Header;
