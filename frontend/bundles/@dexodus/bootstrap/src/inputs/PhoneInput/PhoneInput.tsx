"use client";

import React, {useEffect, useState} from "react";
import TextInput from "../TextInput";
import {Input, InputProps} from "../types";
import {
    Country,
    CountryPhoneFormat,
    getCoincidencesByPhone,
    getCountryByISO, getCountryByPhoneFormat,
    getCountryPhoneFormat,
    getEmojiIconForCountry,
} from "../../common/countries";
import {mergePhoneMasks} from "../../common/mask";

interface PhoneInputProps extends InputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
    availableCountries?: Country[]|string[];
}

const PhoneInput: Input<PhoneInputProps> = (
    {
        value,
        setValue,
        availableCountries,
        icon: emptyIcon,
        ...otherProps
    },
) => {
    const [mask, setMask] = useState<string|undefined>();
    const [countryPhoneFormats, setCountryPhoneFormats] = useState<CountryPhoneFormat[]>([]);
    const [icon, setIcon] = useState<React.ReactNode>(emptyIcon);

    useEffect(() => {
        if (availableCountries) {
            const countries = availableCountries.map(availableCountry => typeof availableCountry === 'string' ? getCountryByISO(availableCountry) : availableCountry);
            const filteredCountries = countries.filter(country => country !== null) as Country[];
            const countryPhoneFormats = filteredCountries.map(country => getCountryPhoneFormat(country));

            setCountryPhoneFormats(countryPhoneFormats);
        }
    }, []);

    const onValueUpdate = (value: string|null): void => {
        let coincidencesCountryPhoneFormats = getCoincidencesByPhone(value ?? '');

        if (availableCountries) {
            coincidencesCountryPhoneFormats = countryPhoneFormats.filter(countryPhoneFormat => countryPhoneFormats.includes(countryPhoneFormat))
        }

        setIcon(emptyIcon);

        if (coincidencesCountryPhoneFormats.length === 1) {
            const country = getCountryByPhoneFormat(coincidencesCountryPhoneFormats[0]);

            if (country) {
                setIcon(getEmojiIconForCountry(country));
            }
        }

        const generalMask = mergePhoneMasks(coincidencesCountryPhoneFormats);

        setMask(generalMask);
    }

    useEffect(() => {
        onValueUpdate(value);
    }, [value]);

    return (
        <TextInput
            value={value}
            setValue={setValue}
            mask={mask}
            icon={icon}
            {...otherProps}
        />
    );
};

export default PhoneInput;
