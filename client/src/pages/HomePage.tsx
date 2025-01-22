import { Button } from "../components/ui/button";
import homeImage from "../assets/home.png";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <div className="lg:mx-40 md:mx-10 py-10 lg:py-20">
        <div className="md:flex text-center md:text-left md:items-center mx-auto justify-between">
          <div className="md:w-1/2 p-4">
            <h1 className="text-[30px] tracking-tight font-semibold md:mr-10 mx-auto">
              The most comprehensive foreclosure database in the world.
            </h1>
            <Link to="/login">
              <Button className="my-4" size={"lg"}>
                Client Login
              </Button>
            </Link>
          </div>

          <div className="md:w-1/2">
            <div className="w-fit lg:relative lg:w-full lg:pb-[100%] p-3 md:w">
              <img
                className="w-full h-auto lg:absolute lg:top-0 lg:left-0 lg:w-full lg:h-full lg:object-cover object-contain"
                src={homeImage}
                alt="Image Description"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
