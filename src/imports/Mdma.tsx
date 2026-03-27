import imgImage87 from "figma:asset/bfc20b12edb8c711ad76ca54051c2443f5582e45.png";

function Frame() {
  return (
    <div className="h-[130px] relative shrink-0 w-[170px]">
      <div className="-translate-x-1/2 absolute h-[112.807px] left-[calc(50%+1.5px)] top-[7.6px] w-[86.646px]" data-name="image 87">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImage87} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[1.5] relative shrink-0 whitespace-nowrap">
      <p className="font-['Roboto:Bold',sans-serif] font-bold relative shrink-0 text-[18px] text-white tracking-[0.36px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Poppers
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal opacity-40 relative shrink-0 text-[#f1f1f1] text-[12px] tracking-[0.24px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Liquid Gold | Snappers | PP
      </p>
    </div>
  );
}

function Inhalants() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[12.774px] shrink-0" data-name="Inhalants">
      <div aria-hidden="true" className="absolute border-[#eee] border-[0.71px] border-solid inset-0 pointer-events-none rounded-[12.774px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#eee] text-[10px] tracking-[0.2px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Inhalants
      </p>
    </div>
  );
}

function Mdma1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start justify-end relative shrink-0" data-name="mdma">
      <Frame1 />
      <Inhalants />
    </div>
  );
}

export default function Mdma() {
  return (
    <div className="bg-[#171717] relative rounded-[16px] size-full" data-name="MDMA">
      <div className="content-stretch flex flex-col items-start justify-between max-w-[inherit] min-w-[inherit] overflow-clip px-[8px] py-[10px] relative rounded-[inherit] size-full">
        <Frame />
        <Mdma1 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.2px] border-[rgba(241,241,241,0.2)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}