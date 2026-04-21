const SectionHeading = ({ title, subtitle }) => {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <div className="mx-auto mt-3 h-0.5 w-16 bg-brushedGold" />
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-xl text-sm text-textSoft sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
