import React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import axios from "axios";
import sinon from "sinon";
import App from "../src/App";

Enzyme.configure({ adapter: new EnzymeAdapter() });

// Setup some reusability here...
const setup = (props = {}, state = null) => {
  const wrapper = shallow(<App {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

describe("<App />", () => {
  const result = [
    {
      id: 1,
      name: "Leanne Graham",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496"
        }
      },
      phone: "1-770-736-8031 x56442"
    }
  ];
  const promise = Promise.resolve(result);

  before(() => {
    sinon
      .stub(axios, "get")
      .withArgs("/api/users")
      .returns(promise);
  });

  after(() => {
    axios.get.restore();
  });

  it("renders the app without error", () => {
    const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, "component-app");
    expect(appComponent).to.have.length(1);
  });

  it("renders loading message when data has not loaded yet", () => {
    const wrapper = setup();
    const loadingText = findByTestAttr(wrapper, "loading-text");

    // We should have a single loading text element
    expect(loadingText).to.have.length(1);

    // Loading text should be equal (irrelevant test really)
    expect(loadingText.text()).to.equal("Loading.. please wait!");
  });

  it("userData state is null to start", () => {
    const wrapper = setup();
    expect(wrapper.state().userData).to.be.null;
  });

  it("does not render loading message when data is loaded", () => {
    const wrapper = setup();
    promise.then(result => {
      wrapper.setState({ userData: result });
      const loadingText = findByTestAttr(wrapper, "loading-text");
      //console.log("LOADING_TEXT", loadingText);
      //console.log("LOADING_TEXT", typeof loadingText);
      expect(loadingText.exists()).to.be.false;
    });
  });

  it("has updated the userData state", () => {
    const wrapper = setup();
    promise.then(result => {
      wrapper.setState({ userData: result });
      expect(wrapper.state().userData).to.equal(result);
    });
  });

  it("has rendered user data which includes a single user row", () => {
    const wrapper = setup();
    promise.then(result => {
      wrapper.setState({ userData: result });
      const userRow = findByTestAttr(wrapper, "user-row");
      expect(userRow.exists()).to.be.true;
      expect(userRow).to.have.length(1);
    });
  });

  it("does not render address in user row", () => {
    const wrapper = setup();
    promise.then(result => {
      wrapper.setState({ userData: result });
      const userAddress = findByTestAttr(wrapper, "user-address");
      //console.log("USER_ADDRESS", userAddress);
      //console.log("USER_ADDRESS", typeof userAddress);
      expect(userAddress.exists()).to.be.false;
    });
  });

  it("renders and hides user address on button clicks", () => {
    const wrapper = setup();
    promise.then(result => {
      wrapper.setState({ userData: result });
      let userAddress;
      let addressBtn = findByTestAttr(wrapper, "address-btn");
      addressBtn.simulate("click");
      userAddress = findByTestAttr(wrapper, "user-address");
      addressBtn = findByTestAttr(wrapper, "address-btn");
      expect(userAddress.exists()).to.be.true;
      expect(userAddress).to.have.length(1);
      expect(addressBtn.text()).to.equal("Hide");
      addressBtn.simulate("click");
      userAddress = findByTestAttr(wrapper, "user-address");
      addressBtn = findByTestAttr(wrapper, "address-btn");
      expect(userAddress.exists()).to.be.false;
      expect(addressBtn.text()).to.equal("Show");
    });
  });
});
