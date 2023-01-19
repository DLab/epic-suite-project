import { Link, Icon } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";

import Page404 from "../pages/404";

describe("Home", () => {
    it("renders page correctly", () => {
        render(<Page404 />);
    });
    it("renders correctly", () => {
        const homePageLink = renderer
            .create(<Link href="/">Home Page</Link>)
            .toJSON();
        expect(homePageLink).toMatchSnapshot();
    });
});
