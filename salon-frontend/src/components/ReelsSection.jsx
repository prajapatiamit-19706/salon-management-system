import { VideoSection } from "../UI/VideoSection"
import PageMotion from "./pageMotion"

export const ReelsSection = () =>{
    return <>
          <section className=" justify-center flex-col items-center px-6 py-26 ">
            <h1 className="text-center text-3xl font-bold font-serif mb-10"> Salon Moments ✨</h1>
               <PageMotion>

                <VideoSection/>
               </PageMotion>
          </section>
    </>
}