import Image from "next/image";

export default function Home() {
  return (
    <div className="container-custom py-4">
      <div className="grid grid-cols-[30%_70%] gap-8 items-center">
        <div className="grid grid-rows-[40%_60%] gap-8">
          <div>
            <Image
              src="https://images.pexels.com/photos/2575372/pexels-photo-2575372.jpeg"
              alt="Hero Image"
              width={500}
              height={500}
              className="w-full h-auto rounded-4xl"
              loading="eager"
            />
          </div>
          <div className="rounded-4xl bg-secondary p-8">
            <h1 className="uppercase font-extrabold text-white text-3xl">Find your perfect herbs at HerbSpot</h1>
            <p className="text-lg text-white/50 mt-4">
              Discover a wide variety of high-quality herbs and natural remedies to support your health and wellness journey.
            </p>
          </div>
        </div>

        <div>
          <Image
            src="https://images.pexels.com/photos/7876182/pexels-photo-7876182.jpeg"
            alt="Hero Image"
            width={500}
            height={400}
            className="w-full rounded-4xl h-150 object-cover"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
