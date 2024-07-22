import "./AboutPage.scss";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { PartnerModal } from "../../../widgets/PartnerModal";
import { sendPartnerEmail } from "../../../app/providers/StoreProvider/partnerSlice";

export function AboutPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const dispatch = useDispatch();
  const emailStatus = useSelector((state) => state.email.status);
  const emailError = useSelector((state) => state.email.error);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleSubmit = (formData) => {
    dispatch(sendPartnerEmail(formData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(
          "Спасибо за заявку, в ближайшее время с вами свяжется наш менеджер",
          {
            position: "top-center",
            className: "custom-toast",
          }
        );
      } else {
        toast.error(`Ошибка при отправке письма: ${emailError}`, {
          position: "top-center",
          className: "custom-toast",
        });
      }
    });
  };

  return (
    <div className="partner_page">
      <h1>
        Мы Media Hub. Пропиарь свою медийку с нами! Профессионально!
        Качественно! Выгодно!
      </h1>
      <h1>Что такое Media Hub?</h1>
      <h2>
        Если коротко: Это платформа, в которой собраны медийные личности, от
        спортсменов, до блогеров и артистов, у каждого из которых вы можете
        приобрести разовую рекламу или даже заключить долгосрочный контракт.
      </h2>
      <ul>
        Если подробнее: Чем полезен Media Hub для клиентов?
        <li>1. Прозрачные и доступные цены;</li>
        <li>
          2. Отобранные медийные люди. Только с качественной и проверенной
          аудиторией;
        </li>
        <li>
          3. Возможность выбрать медийное лицо из своего региона, а также
          подобрать под свою целевую аудиторию;
        </li>
        <li>4. Гарантия соблюдения всех условий и обратная связь;</li>
        <li>
          5. Помощь с идеей для рекламы и ее реализации. Большой опыт команды;
        </li>
        <li>
          6. Возможность личной встречи с медийным лицом (при необходимости),
          для заключения крупного рекламного контракта;
        </li>
        <li>7. Постоянное пополнение списка медийных лиц;</li>
        <li>8. Выбор площадки (соц. сети) для размещения рекламы;</li>
        <li>
          9. Помощь менеджера в выборе медийного лица, с учетом его аудитории и
          охватов, обсуждение всех нюансов, полное сопровождение и контроль
          исполнения сделки;
        </li>
        <li>
          10. Стабильное сотрудничество, специальные предложения, программы
          лояльности и скидки для постоянных клиентов;
        </li>
        <li>
          11. Собственный продакшн, качественно отснимем вашу рекламу, а также
          поможем ее продвинуть и пропиарить.
        </li>
      </ul>
      <ul>
        С уходом монетизации от просмотров на многих платформах, стало сложнее
        получать материальную выгоду от своей медийности. Мы поможем это
        исправить. Плюсы для партнеров, что дает сервис:
        <li>
          1. Поиск потенциальных клиентов, их привлечение, обработка заявок и
          формирование четкого предложения;
        </li>
        <li>
          2. Взаимодействие с менеджером, руководством по любым вопросом,
          связанным с деятельностью компании;
        </li>
        <li>3. Профессиональный подход, опытная команда;</li>
        <li>
          4. Конфиденциальность условий сделок перед третьим лицами,
          прозрачность между сторонами;
        </li>
        <li>5. Гарантия соблюдения всех условий и обратная связь;</li>
        <li>
          6. Не нужно производить никакие усилия, делать вложения. Вам больше
          необязателен личный рекламный менеджер, у вас будет личная ссылка на
          вашу страницу в платформе, которую можно разместить у себя в
          социальных сетях;
        </li>
        <li>7. Помощь в съемке и реализации заказа под клиента;</li>
        <li>
          8. В случае блокировки или перехода на другие площадки об этом будут
          узнавать клиенты, информация будет обновляться
        </li>
      </ul>
      {emailStatus === "loading" ? (
        <div className="mobile-order-loader">
          <BarLoader />
        </div>
      ) : (
        <button type="button" className="btn_submit" onClick={handleOpenModal}>
          Стать партнером
        </button>
      )}
      <PartnerModal
        isOpen={modalIsOpen}
        onSubmit={handleSubmit}
        setModalIsOpen={setModalIsOpen}
      />
      <ToastContainer />
    </div>
  );
}
