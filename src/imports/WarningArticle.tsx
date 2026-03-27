function RiskTags() {
  return (
    <div className="bg-[#ff5545] content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[18px] shadow-[0px_3px_3px_0px_rgba(160,34,34,0.33)] shrink-0" data-name="risk tags">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#0d0d0d] text-[16px] tracking-[0.32px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Warning
      </p>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col items-start justify-end relative shrink-0 w-full" data-name="header">
      <div className="font-['TT_Travels_Next_Trial_Variable:ExtraBold',sans-serif] font-[807.4829711914062] leading-[26px] not-italic relative shrink-0 text-[#f3efef] text-[24px] tracking-[0.48px] uppercase whitespace-nowrap">
        <p className="mb-0">Fake batch</p>
        <p>of Oxycodone</p>
      </div>
    </div>
  );
}

function NewsText() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[280px]" data-name="news text">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#f3efef] text-[16px] tracking-[0.32px] w-[284px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Fentanyl was found in a batch of oxycodone in Berlin on 12.05.2025
      </p>
    </div>
  );
}

function NewsHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[158px] items-start relative shrink-0 w-full" data-name="news header">
      <RiskTags />
      <Header />
      <NewsText />
    </div>
  );
}

function MainButton({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="backdrop-blur-[10px] h-[50px] relative rounded-[8px] shrink-0 w-full cursor-pointer"
      data-name="main button"
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border border-[#c9b2ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center p-[24px] relative size-full">
          <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#efe3f6] text-[18px] tracking-[0.36px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Read the article
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WarningArticle({ onReadArticle }: { onReadArticle?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[42px] items-start overflow-clip pb-[16px] pt-[72px] px-[16px] relative rounded-[16px] size-full" data-name="warning article">
      <div aria-hidden="true" className="absolute inset-0 mix-blend-multiply pointer-events-none rounded-[16px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 386 338\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(3.75 23.9 -20.955 3.288 193 41.5)\\' opacity=\\'1\\'><rect height=\\'171.09\\' width=\\'159.83\\' fill=\\'url(%23grad)\\' id=\\'quad\\' shape-rendering=\\'crispEdges\\'/><use href=\\'%23quad\\' transform=\\'scale(1 -1)\\'/><use href=\\'%23quad\\' transform=\\'scale(-1 1)\\'/><use href=\\'%23quad\\' transform=\\'scale(-1 -1)\\'/></g><defs><linearGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' x2=\\'5\\' y2=\\'5\\'><stop stop-color=\\'rgba(86,126,123,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(113,134,149,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(141,141,176,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(176,136,188,1)\\' offset=\\'1\\'/></linearGradient></defs></svg>')" }} />
      <div className="absolute h-[265px] left-[26px] top-[-200px] w-[322px]">
        <div className="absolute inset-[-40.45%_-33.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 536.4 479.4">
            <g filter="url(#filter0_f_12_182)" id="Ellipse 19" opacity="0.5">
              <ellipse cx="268.2" cy="239.7" fill="var(--fill-0, #5C409F)" rx="161" ry="132.5" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="479.4" id="filter0_f_12_182" width="536.4" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_12_182" stdDeviation="53.6" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <NewsHeader />
      <MainButton onClick={onReadArticle} />
    </div>
  );
}