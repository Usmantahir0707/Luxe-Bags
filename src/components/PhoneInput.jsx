import { useEffect, useState } from "react";

export default function PhoneInput({ value, setValue, inputStyle, border, listHeight}) {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [placeholder, setPlaceholder] = useState("Enter Phone Number");
  const [showCountries, setShowCountries] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCountry) {
      const newDial = selectedCountry.calling_code;
      setValue(newDial);
      setPlaceholder(selectedCountry.example);
    }
  }, [selectedCountry]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const [countriesRes, ipRes] = await Promise.all([
          fetch(
            "https://raw.githubusercontent.com/Usmantahir0707/CountriesPhone/refs/heads/main/countriesNumbers.json"
          ),
          fetch("https://ipwho.is/")
        ]);
        const [countriesData, ipData] = await Promise.all([
          countriesRes.json(),
          ipRes.json(),
        ]);
        setCountries(countriesData);

        const code = "+" + ipData.calling_code;
        const matched = countriesData.find((c) => c.calling_code === code);

        matched && setSelectedCountry(matched);

        setLoading(false);
        
      } catch (err) {
        console.error("Country detect failed:", err);
      }
    };
    getCountries();
  }, []);

  const dialCode = selectedCountry && selectedCountry.calling_code;

  const trimmedValue =
    value && dialCode && value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;

 const formattedValue =
  selectedCountry?.example && trimmedValue
    ? (() => {
        const digits = trimmedValue.replace(/\D/g, "");
        let formatted = "";
        let digitIndex = 0;
        for (
          let i = 0;
          i < (selectedCountry.example?.length || 0) && digitIndex < digits.length;
          i++
        ) {
          if (selectedCountry.example[i] === " ") {
            formatted += " ";
          } else {
            formatted += digits[digitIndex];
            digitIndex++;
          }
        }
        return formatted;
      })()
    : trimmedValue;

  const handleChange = (e) => {
    if (!dialCode) return;
    const digits = e.target.value.replace(/\D/g, "");
    const newVal = dialCode + digits;
    setValue(newVal);
    
  };

  return (
    <div
      role="container"
      className={`flex items-center text-[14px] gap-2 bg-gray-300 p-2 h-[50px] max-w-[270px] ${inputStyle && inputStyle}`}
    >
      <div
        onClick={() => setShowCountries((p) => !p)}
        className="flex items-center cursor-pointer relative h-full"
      >
        <span className="text-[8px] text-(--text-4)">▼</span>
        <ul className="ml-1 min-w-[20px]">
          <li>
            {loading ? (
              <div className="w-[15px] h-[15px] border-t-2 rounded-[50%] animate-spin"></div>
            ) : (
              <img
                className="w-6 h-4 object-cover rounded-sm"
                src={selectedCountry?.flag || ""}
                alt="flag"
              />
            )}
          </li>
        </ul>
        {showCountries && (
          <div className={`bg-gray-300 flex gap-1 flex-col absolute h-[180px] w-[265px] -bottom-[180px] left-[-5px] rounded-md hide-scrollbar p-0 pb-0 overflow-y-auto text-left
          ${inputStyle && inputStyle} ${border && border}`}>
            <div className={`bg-white sticky top-0 left-0 shadow-2xl h-[41px] w-[220px] rounded-md px-2 pb-2
              ${inputStyle && inputStyle} ${border && border}`}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="focus:outline-none focus:ring-0 h-full p-1 py-2"
                onClick={(e) => e.stopPropagation()}
                type="text"
                placeholder="🔎 Search country..."
              />
            </div>
            <ul className="flex gap-1 flex-col">
              {countries
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .filter((f) =>
                  f.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((x) => (
                  <li
                    key={x.name}
                    onClick={() => setSelectedCountry(x)}
                    className="border-b border-gray-400 py-2 w-full"
                  >
                    <div className="flex gap-2 h-[20px] w-full justify-between">
                      <div className="flex gap-2">
                        <img
                          className="w-[30px] object-cover"
                          src={x.flag}
                          alt=""
                        />
                        <h2
                          className="truncate w-[120px]"
                          title={x.name}
                        >
                          {x.name}
                        </h2>
                      </div>

                      <p>
                        (
                        {x.calling_code}
                        )
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <span>{dialCode}</span>
      <input
        className={`"bg-gray-300 h-[50px] focus:outline-none focus:ring-0 max-w-[250px] flex-1 ${inputStyle && inputStyle}`}
        type="tel"
        maxLength={selectedCountry?.example?.length || 20}
        inputMode="numeric"
        placeholder={placeholder}
        value={formattedValue}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}
