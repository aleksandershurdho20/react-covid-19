import * as React from 'react';
import ReactFlagsSelect from 'react-flags-select';
import styled from 'styled-components';
import 'react-flags-select/css/react-flags-select.css';

import Error from './Error';
import Loading from './Loading';
import Stats from './Stats';
import useDataApi from '../hooks/useDataApi';
import { CountryResponse } from '../types';
import Row from './Row';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const CountrySection = styled.section`
  margin-top: 1rem;
`;

const WrapperSelect = styled.div`
  .flag-select {
    margin: 10px;
    .filterBox input {
      padding: 5px;
      font-size: 13px;
      border: 1px solid ${({ theme }) => theme.colors.text};
    }
  }
  .flag-select__btn {
    background: ${({ theme }) => theme.colors.backgroundLight};
    outline: 0;
    color: ${({ theme }) => theme.colors.text};
    ::after {
      border-top: 5px solid ${({ theme }) => theme.colors.text};
    }
  }
  .flag-select__options {
    border: 1px solid ${({ theme }) => theme.colors.background};
    border-radius: 0;
    background: ${({ theme }) => theme.colors.backgroundLight};
    max-height: 300px;
  }
`;

const CountryPicker = () => {
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [countries, setCountries] = React.useState<string[]>([]);

  const [{ data, isLoading, isError }] = useDataApi<CountryResponse>({
    initUrl: `${API_ENDPOINT}/countries`,
    defaultData: {},
  });

  React.useEffect(() => {
    if (data && data.countries) {
      const iso2 = data.countries.map(c => c.iso2);
      setCountries(iso2);
    }
    fetch(`https://ipapi.co/country`)
      .then(res => res.text())
      .then(setSelectedCountry)
      .catch(() => setSelectedCountry('ID'));
  }, [data]);

  if (isLoading) {
    return <Loading speed={300} />;
  }

  return (
    <CountrySection className="center-text">
      {isError && (
        <Row>
          <Error message="There was a problem fetching countries" />
        </Row>
      )}
      {selectedCountry && (
        <>
          <WrapperSelect>
            <ReactFlagsSelect
              countries={countries}
              searchable={true}
              defaultCountry={selectedCountry}
              onSelect={code => setSelectedCountry(code)}
            />
          </WrapperSelect>
          <Stats url={`${API_ENDPOINT}/countries/${selectedCountry}`} />
        </>
      )}
    </CountrySection>
  );
};

export default CountryPicker;
