import { useTranslation } from "react-i18next";
import StickerTitle from "../../components/StickerTitle";
import studioImg from "./studio.png";

const Studio = (props: {}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-center">
        <StickerTitle className="text-6xl md:text-8xl mt-6 mb-6">
          {t("studio.title")}
        </StickerTitle>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-12 mb-8 bg-white rounded-4xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-1/2">
              <p className="text-xl text-zinc-800 leading-relaxed mb-6">
                {t("studio.paragraph1")}
              </p>
              <p className="text-xl text-zinc-800 leading-relaxed mb-6">
                {t("studio.paragraph2")}
              </p>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <img
                src={studioImg}
                alt="VIRA LATA ESTÚDIO"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
            <div className="w-full bg-gray-50 rounded-2xl overflow-hidden self-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.123456789!2d-9.1268893!3d38.7334901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f50.1!3m3!1m2!1s0xd1933871dd683c9:0x4ab767dce804244c!2sVIRA+LATA+EST%C3%9ADIO!5e0!3m2!1spt!2spt!4v1234567890!5m2!1spt!2spt"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VIRA LATA ESTÚDIO"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Studio;
