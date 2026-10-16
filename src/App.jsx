import Navbar from './components/Navbar';
import { useTheme } from './context/ThemeContext';
import HeroImage from 'E:/Scoreflex/scoreflex/src/assets/hero-image.png'
import HeroDarkImage from '../src/assets/dark-hero-image.png'
import './App.css';

function App() {
  const { theme, changeTheme } = useTheme();
  return (
    <>
      <Navbar />
      <section className="bg-white dark:bg-gray-900" style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
        <div className="flex lg:flex-row flex-col items-center justify-between max-w-7xl px-6 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-0 lg:grid-cols-12">

          <div className=" col-span-12 lg:col-span-7 mx-auto flex lg:flex-col text-center lg:text-start gap-4 mt-0">
            <span className="flex items-center gap-1.5 rounded-full bg-blue-200 p-1.5 text-[12px] font-semibold text-[#101C32] w-[40%]">
              <span className="h-2.25 w-2.25 rounded-full bg-[#2850E8]" />
              NEXT - GEN LIVE KNOWLEDGE TESTING HUB
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl xl:text-6xl mt-0" style={{ color: theme.color }}>Turn your ideas into
             <span className='bg-linear-to-r from-[#2850E8] to-[#6545D8] bg-clip-text text-transparent'> interactive quizzes </span></h1>
            <p className="font-light text-gray-500  md:text-lg  dark:text-gray-400 text-[14px]" style={{ color: theme.color }}>Create, host and play quizzes with friends, colleagues, or your global community. It's fast, beautifully responsive, and designed for pure engagement.</p>
            <div className='mt-4'>
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900" style={{ color: theme.color }}>
                Join Quiz
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              </a>
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800" style={{ color: theme.color }}>
                Create the Quiz
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            
            <img src={theme.mode == "light"? HeroImage : HeroDarkImage} alt="quiz" className='' />
          </div>
        </div>
      </section>
    </>
  )
}

export default App
