const HeroSection = () => {
  return (
    <section className="relative flex min-h-[82vh] items-center overflow-hidden pt-16 sm:pt-20">
      <img
        src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=2000&q=80"
        alt="Luxury kitchen faucet"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-brushedGold">
            Premium Bath & Kitchen Hardware
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
            Redefine Luxury in Every Detail
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
            Handpicked premium fixtures for discerning spaces with brushed gold
            and slate matte finishes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#categories"
              className="rounded-sm border border-white/35 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-brushedGold hover:text-brushedGoldSoft"
            >
              Explore Collection
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
