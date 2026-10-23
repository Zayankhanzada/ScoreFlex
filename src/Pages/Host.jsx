import { Link } from "react-router-dom"
import { House } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"


export default function Host() {
  const { theme, changeTheme, mode } = useTheme();
  return (
    <>
      <Navbar />
      <section className="container py-12" style={{backgroundColor:theme.backgroundColor}}>
        <div className="Paging text-start gap-5 px-20">
          <h6 className="inline-flex items-center gap-1"> <Link to="/" className="hover:text-blue-600"> <House /> </Link> {" > "}  Host Setup </h6>
        </div>

        <div className=" px-30 mt-10 text-start">
          <h2 className="font-extrabold text-start lg:text-[40px]" style={{ color: theme.color }}> Create A Quiz</h2>
          <p className="">  Choose how you want to create your quiz  </p>
        </div>
      </section>
      <Footer />
    </>
  )
}
