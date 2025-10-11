export function HeroSection() {
  return (
    <section className="flex flex-col gap-4 md:gap-6 items-center justify-center overflow-clip pb-6 md:pb-10 pt-8 md:pt-12 lg:pt-[60px] px-4 md:px-10 lg:px-20 text-center">
      <h1 className="text-3xl md:text-5xl lg:text-[72px] font-normal text-black leading-tight md:leading-[1.3] lg:leading-[96px] whitespace-pre">
        giao diện thật,{'\n'}từ sản phẩm thật
      </h1>
      <p className="text-base md:text-xl lg:text-2xl font-normal text-black leading-6 md:leading-7 lg:leading-8 w-full max-w-full">
        giao diện được thu thập từ hơn 100 ứng dụng tại Việt Nam
      </p>
    </section>
  )
}
