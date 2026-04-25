import Image from "next/image";
import Link from "next/link";
import { BiAward, BiBox } from "react-icons/bi";
import { SiFresh } from "react-icons/si";

export default function Home() {
  return (
    <div className="container-custom py-4">
      <div className="grid grid-cols-[30%_70%] gap-8 items-center">
        <div className="grid grid-rows-[40%_60%] gap-8">
          <div className="relative md:w-full">
            <Image
              src="https://images.pexels.com/photos/2575372/pexels-photo-2575372.jpeg"
              alt="Hero Image"
              fill
              className="w-full h-auto rounded-4xl"
              loading="eager"
            />
          </div>
          <div className="relative rounded-4xl bg-secondary p-8">
            <h1 className="uppercase font-extrabold text-white text-lg md:text-3xl">Find your perfect herbs at HerbSpot</h1>
            <p className="text-sm md:text-lg text-white/50 mt-4">
              Discover a wide variety of high-quality herbs and natural remedies to support your health and wellness journey.
            </p>
            <Link href="/products" >
              <button className="btn-primary mt-8 mb-16">Explore Herbs</button>
            </Link>
          </div>
        </div>

        <div>
          <Image
            src="https://images.pexels.com/photos/7876182/pexels-photo-7876182.jpeg"
            alt="Hero Image"
            width={500}
            height={400}
            className="w-full rounded-4xl h-180 object-cover"
            loading="eager"
          />
        </div>
      </div>

      <div className="mt-20 mb-16 md:my-32">
        <h2 className="text-3xl md:text-6xl text-center text-primary">We are an independent herb choice for high-quality, organic herbs</h2>

        <div className="grid grid-cols-3 gap-8 mt-8">
          <div className="relative overflow-hidden ">
            <Image
              src="https://images.pexels.com/photos/34786539/pexels-photo-34786539.jpeg"
              alt="Hero Image"
              fill
              className="w-full rounded-4xl object-cover h-30 md:h-50"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/40 h-50 rounded-4xl"></div>
            <p className="absolute inset-0 flex flex-col items-center justify-center text-white uppercase font-bold">Herbs</p>

          </div>
          <div className="relative overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/11614081/pexels-photo-11614081.jpeg"
              alt="Hero Image"
              width={200}
              height={200}
              className="w-full rounded-4xl object-cover h-50"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/40 h-50 rounded-4xl"></div>

            <p className="absolute inset-0 flex flex-col items-center justify-center text-white uppercase font-bold">Spices</p>
          </div>
          <div className="relative overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/34296580/pexels-photo-34296580.jpeg"
              alt="Hero Image"
              width={200}
              height={200}
              className="w-full rounded-4xl object-cover h-50"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/40 h-50 rounded-4xl"></div>
            <p className="absolute inset-0 flex flex-col items-center justify-center text-white uppercase font-bold">Aromatic</p>
          </div>

          <Link href="/products" className="col-span-3 flex justify-center">
            <button className="btn-primary mt-8 mb-16">View all Herbs</button>
          </Link>
        </div>
      </div>

      <div className="bg-primary/20 p-10">
        <div className="flex flex-col">
          <div className="text-2xl text-primary font-bold text-center my-8">
            <p>HerboSpot Quality Promise</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:flex-row  items-center justify-between">
          <div className="text-2xl text-primary font-bold flex items-center bg-white rounded-2xl py-5 px-3">
            <BiAward size={40} className="font-extrabold" />
            <p className="text-sm md:text-lg">High Quality Herbs</p>
          </div>
          <div className="text-2xl text-primary font-bold flex items-center bg-white rounded-2xl py-5 px-3">
            <SiFresh size={40} className="font-extrabold" />
            <p className="text-sm md:text-lg">Freshness preserved</p>
          </div>
          <div className="text-2xl text-primary font-bold flex items-center bg-white rounded-2xl py-5 px-3">
            <BiBox size={40} className="font-extrabold" />
            <p className="text-sm md:text-lg">Easy refunds and returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
