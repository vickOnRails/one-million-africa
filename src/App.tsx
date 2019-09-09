import React, { Component } from "react";
import "./App.css";
import Data from "./data.json";

const Table = ({
  searchResult
}: {
  companies: Array<any>;
  searchResult: Array<any>;
}) => {
  let companyResults = (
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
  );

  let errorMessage = (
    <p>The company you're looking for is not on this list. </p>
  );

  return <>{searchResult.length === 0 ? errorMessage : companyResults}</>;
};

const Header: React.FC = () => (
  <header className="header">
    <div className="container">
      <nav className="header__nav">
        <div className="header__nav--container">
          <a href="" className="header__nav--button_link">
            Add Startup
          </a>
        </div>
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
  { companies: Array<{}>; searchResult: Array<{}> }
> {
  state = {
    companies: [],
    searchResult: []
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>, action: string) => {
    if (action === "filterCompanyName") {
      if (e.target.value.length === 0) {
        this.setState(prevState => {
          return { searchResult: prevState.companies };
        });
      }
      let resultArr = this.filterByCompanies(e.target.value);
      this.setState({ searchResult: resultArr });
    } else if (action === "filterHQCountry") {
      let country = e.target.value;
      let resultCountry = this.filterByCountry(country);
      this.setState(prevState => {
        return { searchResult: resultCountry };
      });
    } else {
      let sector = e.target.value;
      if (sector === "all") {
        this.setState(prevState => {
          return { searchResult: prevState.companies };
        });
      } else {
        let resultSector = this.filterBySectors(sector);
        this.setState(prevState => {
          return { searchResult: resultSector };
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
          <Sort onChange={this.onChange} />
          <Table companies={companies} searchResult={this.state.searchResult} />
        </section>
      </main>
    );
  }
}

const SearchBox = ({ onChange }: { onChange: any }) => (
  <div className="searchbox search_company">
    <label>
      <p className="input_label">Search Company</p>
      <input
        type="text"
        className="searchbox__input"
        onChange={e => onChange(e, "filterCompanyName")}
      />
    </label>
  </div>
);

const Filter = ({ onChange }: { onChange: any }) => {
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
                onChange={e => onChange(e, "filterHQCountry")}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

const Sort = ({ onChange }: { onChange: any }) => (
  <div className="sort__flex" id="list-start">
    <SearchBox onChange={onChange} />
    <Filter onChange={onChange} />
  </div>
);

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Body />
    </div>
  );
};

export default App;
