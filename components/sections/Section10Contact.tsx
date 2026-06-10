"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { CONTACT, PROJECT } from "@/lib/constants";

const inputClass =
  "w-full border-0 border-b border-line bg-transparent py-4 text-bone " +
  "placeholder:text-stone/60 transition-colors duration-500 " +
  "focus:border-brass focus:outline-none";

export default function Section10Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    /* TODO: подключить CRM/эндпоинт отправки заявок */
    setSent(true);
  };

  return (
    <section id="contact" className="bg-ink section-pad">
      <div className="container-luxe">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading kicker={CONTACT.kicker} title={CONTACT.title} />
            <p className="mt-10 max-w-130 text-stone">{CONTACT.body}</p>

            <div className="mt-14 space-y-3 text-sm text-stone">
              <p>{CONTACT.office}</p>
              <p>
                <a
                  href={`tel:${PROJECT.phone.replace(/\s/g, "")}`}
                  className="text-bone transition-colors duration-300 hover:text-brass"
                  data-cursor="hover"
                >
                  {PROJECT.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${PROJECT.email}`}
                  className="text-bone transition-colors duration-300 hover:text-brass"
                  data-cursor="hover"
                >
                  {PROJECT.email}
                </a>
              </p>
            </div>
          </div>

          <div className="lg:pt-24" aria-live="polite">
            {sent ? (
              <div className="hairline-t pt-10">
                <p className="display-2">Благодарим за обращение</p>
                <p className="mt-6 max-w-100 text-stone">
                  Персональный менеджер свяжется с вами в течение часа, чтобы
                  согласовать удобное время встречи.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                <div>
                  <label htmlFor="contact-name" className="kicker">
                    Имя
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Как к вам обращаться"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="kicker">
                    Телефон
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+7"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-budget" className="kicker">
                    Бюджет
                  </label>
                  <select
                    id="contact-budget"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    className={`${inputClass} appearance-none ${budget ? "" : "text-stone/60"}`}
                  >
                    <option value="" disabled>
                      Выберите диапазон
                    </option>
                    {CONTACT.budgets.map((range) => (
                      <option key={range} value={range} className="bg-ink">
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TODO(M2): обернуть в MagneticButton */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  data-cursor="hover"
                  className="kicker mt-4 inline-flex items-center gap-4 border border-brass/40 px-10 py-5 text-bone transition-colors duration-500 hover:border-brass hover:text-brass"
                >
                  Запросить презентацию
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
