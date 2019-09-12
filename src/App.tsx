import React, { Component } from "react";
import "./App.css";
import Data from "./data.json";
import Void from "./imgs/void.svg";

const Table = ({
  searchResult
}: {
  companies: Array<any>;
  searchResult: Array<any>;
}) => {
  let companyResults = (
    <>
      <p className="search_result container">
        Results for All African <span className="bold">{}</span> Startups
      </p>
      <table className="table">
        <thead className="table__heading">
          <tr className="table__heading--row">
            <th>SN</th>
            <th>Name</th>
            <th>HQ Country</th>
            <th>Sector</th>
            <th>Amount Raised</th>
            <th>Date Raised</th>
            <th>Investors</th>
          </tr>
        </thead>
        <tbody className="table__body">
          {searchResult.map(company => {
            let {
              id,
              name,
              hqCountry,
              sector,
              amountRaised,
              dateRaised,
              investors
            } = company;
            return (
              <tr className="table__body--row">
                <td>{id}</td>
                <td>{name}</td>
                <td>{hqCountry}</td>
                <td>{sector}</td>
                {amountRaised === "Not Available" ? (
                  <td>{amountRaised}</td>
                ) : (
                  <td>${amountRaised}M</td>
                )}

                <td>{dateRaised}</td>
                <td>
                  {investors.map((investor: string) => {
                    return <li>{investor}, </li>;
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );

  let errorMessage = (
    <div className="no_result">
      <img src={Void} alt="Void" className="error-img" />
      <h2 className="centered">Startup not on this list</h2>
    </div>
  );

  return <>{searchResult.length === 0 ? errorMessage : companyResults}</>;
};

const Header: React.FC = () => (
  <header className="header">
    <div className="container">
      <nav className="header__nav">
        {/* <div className="header__nav--container">
          <a href="" className="header__nav--button_link">
            Add Startup
          </a>
        </div> */}
      </nav>

      <div className="header__copy">
        <h1 className="header__heading--1">1 MILLION AFRICA</h1>
        <h2 className="header__heading--2">
          A directory of all African Startups that have raised over $1million in
          2019
        </h2>
        <a href="#list-start" className="header__button--link accent_button">
          See List
        </a>
      </div>
    </div>
  </header>
);

class Body extends Component<
  { children?: React.ReactNode },
  {
    companies: Array<{}>;
    searchResult: Array<{}>;
    companySortValue: string;
    sectorSortValue: string;
    countrySortValue: string;
  }
> {
  state = {
    companies: [],
    searchResult: [],
    companySortValue: "",
    sectorSortValue: "",
    countrySortValue: ""
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>, action: string) => {
    const targetValue = e.target.value;
    if (action === "filterCompanyName") {
      if (targetValue.length < 0) {
        this.setState(prevState => {
          return {
            searchResult: prevState.companies,
            companySortValue: e.target.value
          };
        });
        console.log(this.state.companySortValue);
      }
      let resultArr = this.filterByCompanies(targetValue);
      this.setState({ searchResult: resultArr, companySortValue: targetValue });
    } else if (action === "filterHQCountry") {
      let resultCountry = this.filterByCountry(targetValue);
      this.setState(prevState => {
        return {
          searchResult: resultCountry,
          countrySortValue: targetValue
        };
      });
      console.log(targetValue);
    } else {
      if (targetValue === "all") {
        this.setState(prevState => {
          return { searchResult: prevState.companies };
        });
      } else {
        let resultSector = this.filterBySectors(targetValue);
        this.setState(prevState => {
          return { searchResult: resultSector, sectorSortValue: targetValue };
        });
      }
    }
  };

  filterByCountry = (sortString: string) => {
    let resultArr = this.state.companies.filter((company: any) => {
      return company.hqCountry
        .toLowerCase()
        .startsWith(sortString.toLowerCase());
    });

    return resultArr;
  };

  filterByCompanies = (sortString: string) => {
    let resultArr = this.state.companies.filter((company: any) => {
      return company.name.toLowerCase().startsWith(sortString.toLowerCase());
    });

    return resultArr;
  };

  filterBySectors = (sectorValue: string) => {
    let resultArr = this.state.companies.filter((company: any) => {
      return company.sector.toLowerCase() === sectorValue.toLowerCase();
    });
    return resultArr;
  };

  componentDidMount() {
    this.setState({ companies: Data, searchResult: Data });
  }

  render() {
    const { companies } = this.state;
    return (
      <main className="main">
        <section className="table__container">
          <Sort
            onChange={this.onChange}
            companySortValue={this.state.companySortValue}
            sectorSortValue={this.state.sectorSortValue}
            countrySortValue={this.state.countrySortValue}
          />
          <Table companies={companies} searchResult={this.state.searchResult} />
        </section>
      </main>
    );
  }
}

const SearchBox = ({
  onChange,
  companySortValue
}: {
  onChange: any;
  companySortValue: string;
}) => (
  <div className="searchbox search_company">
    <label>
      <p className="input_label">Search Company</p>
      <input
        type="text"
        className="searchbox__input"
        value={companySortValue}
        onChange={e => onChange(e, "filterCompanyName")}
      />
    </label>
  </div>
);

const Filter = ({
  onChange,
  sectorSortValue,
  countrySortValue
}: {
  onChange: any;
  countrySortValue: string;
  sectorSortValue: string;
}) => {
  const sectorArray = [
    "Education",
    "Jobs",
    "Energy",
    "Logistics & Transport",
    "Housing",
    "Healthcare",
    "Fintech",
    "eGov",
    "retail",
    "Agriculture",
    "Deep Tech",
    "Water"
  ];
  return (
    <div className="filter">
      <p className="filter__text">Sort By</p>
      <div className="filter__flex">
        <div className="select__field">
          <label className="select__label">
            <p className="select__label--text">Sector</p>
            <select
              name="country"
              className="select"
              value={sectorSortValue}
              onChange={e => onChange(e, "filterSector")}
            >
              <option value="all">All</option>
              {sectorArray.map(sector => {
                return <option value={sector}>{sector}</option>;
              })}
            </select>
          </label>
        </div>

        <div className="select__field">
          <label className="select__label">
            <p className="select__label--text">HQ Country</p>
            <div className="searchbox">
              <input
                type="text"
                className="searchbox__input"
                placeholder="Enter Country"
                value={countrySortValue}
                onChange={e => onChange(e, "filterHQCountry")}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

const Sort = ({
  onChange,
  companySortValue,
  sectorSortValue,
  countrySortValue
}: {
  onChange: any;
  companySortValue: string;
  countrySortValue: string;
  sectorSortValue: string;
}) => (
  <div className="sort__flex" id="list-start">
    <SearchBox onChange={onChange} companySortValue={companySortValue} />
    <Filter
      onChange={onChange}
      countrySortValue={countrySortValue}
      sectorSortValue={sectorSortValue}
    />
  </div>
);

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Body />
      <footer className="footer">
        <p>
          Curated by{" "}
          <a
            href="http://twitter.com/vick_onrails"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vick_onrails
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
