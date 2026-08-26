import FlashItem from "./flashItem";

const FlashList = (props: { flashes: any[] }) => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-2">
      {props.flashes.map((flash, i) => (
        <FlashItem key={i} flash={flash} flashId={flash.id} />
      ))}
    </section>
  );
};

export default FlashList;
