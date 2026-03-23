import React, { useEffect, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
// import logo from "../../assets/Logo/Logo-Full-Light.png"
// import Logo from "../../assets/Logo/StudyHub.png"
import { NavbarLinks } from "../../data/navbar-links"
import { useSelector } from 'react-redux'
import { BsChevronDown } from "react-icons/bs"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"

const Navbar = () => {

    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart)

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                setSubLinks(res.data.data)
            } catch (error) {
                console.log("Could not fetch Categories.", error)
            }
            setLoading(false)
        })()
    }, [])

    const location = useLocation()
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }

  return (
      <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
          <div className="flex w-11/12 max-w-maxContent items-center justify-between">
              {/* Logo */}
              <Link to="/">
                  <svg width="200" height="50" viewBox="0 0 260 60" xmlns="http://www.w3.org/2000/svg">

                      <defs>
                          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FFFFFF" />
                              <stop offset="100%" stopColor="#FFFFFF" />
                          </linearGradient>

                          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FFFFFF" />
                              <stop offset="100%" stopColor="#FFFFFF" />
                          </linearGradient>
                      </defs>

                      {/* Icon */}
                      <rect x="5" y="10" rx="12" ry="12" width="40" height="40" fill="url(#grad1)" />

                      <text
                          x="25"
                          y="38"
                          textAnchor="middle"
                          fontSize="20"
                          fontWeight="700"
                          fill="#0A0A0A"
                          fontFamily="Segoe UI, sans-serif"
                      >
                          S
                      </text>

                      {/* Text */}
                      <text
                          x="60"
                          y="38"
                          fontSize="28"
                          fontWeight="700"
                          fontFamily="Segoe UI, sans-serif"
                      >
                          <tspan fill="url(#grad1)">Study</tspan>
                          <tspan fill="url(#grad2)">Hub</tspan>
                      </text>

                  </svg>
              </Link>
              {/* Navigation links */}
              <nav className="hidden md:block">
                  <ul className="flex gap-x-6 text-richblack-25">
                      {NavbarLinks.map((link, index) => (
                          <li key={index}>
                              {link.title === "Catalog" ? (
                                  <>
                                      <div
                                          className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                                                  ? "text-yellow-25"
                                                  : "text-richblack-25"
                                              }`}
                                      >
                                          <p>{link.title}</p>
                                          <BsChevronDown />
                                          <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                              <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                              {loading ? (
                                                  <p className="text-center">Loading...</p>
                                              ) : subLinks?.length ? (
                                                  <>
                                                      {subLinks
                                                          ?.filter(
                                                              (subLink) => subLink?.courses?.length > 0
                                                          )
                                                          ?.map((subLink, i) => (
                                                              <Link
                                                                  to={`/catalog/${subLink.name
                                                                      .split(" ")
                                                                      .join("-")
                                                                      .toLowerCase()}`}
                                                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                  key={i}
                                                              >
                                                                  <p>{subLink.name}</p>
                                                              </Link>
                                                          ))}
                                                  </>
                                              ) : (
                                                  <p className="text-center">No Courses Found</p>
                                              )}
                                          </div>
                                      </div>
                                  </>
                              ) : (
                                  <Link to={link?.path}>
                                      <p
                                          className={`${matchRoute(link?.path)
                                                  ? "text-yellow-25"
                                                  : "text-richblack-25"
                                              }`}
                                      >
                                          {link.title}
                                      </p>
                                  </Link>
                              )}
                          </li>
                      ))}
                  </ul>
              </nav>
              {/* Login / Signup / Dashboard */}
              <div className="hidden items-center gap-x-4 md:flex">
                  {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                      <Link to="/dashboard/cart" className="relative">
                          <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                          {totalItems > 0 && (
                              <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                  {totalItems}
                              </span>
                          )}
                      </Link>
                  )}
                  {token === null && (
                      <Link to="/login">
                          <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                              Log in
                          </button>
                      </Link>
                  )}
                  {token === null && (
                      <Link to="/signup">
                          <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                              Sign up
                          </button>
                      </Link>
                  )}
                  {token !== null && <ProfileDropdown />}
              </div>
              {/* <button className="mr-4 md:hidden">
                  <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
              </button> */}
          </div>
    </div>
  )
}

export default Navbar