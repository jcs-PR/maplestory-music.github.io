/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import './App.scss';
import { Router, Switch, Route, Link, NavLink } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
import { Navbar, Nav } from 'react-bootstrap';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import { DataSourceProvider } from './context/DataSourceContext';
import { ReactElement } from 'react';

ReactGA.initialize(process.env.REACT_APP_GA_TOKEN);
const history = createBrowserHistory();
history.listen((location, action) => {
  ReactGA.pageview(window.location.pathname);
});
ReactGA.pageview(window.location.pathname);

const onNavLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void = (
  e
) => {
  const target = e.currentTarget;
  if (target.pathname === window.location.pathname) {
    e.preventDefault();
  }
};

const Header = (): ReactElement => (
  <Navbar
    css={css`
      margin-bottom: 10px;
    `}
    bg="dark"
    variant="dark"
    expand="lg"
  >
    <Navbar.Brand as={Link} to="/" onClick={onNavLinkClick}>
      <img
        css={css`
          margin-right: 8px;
        `}
        alt=""
        src="./assets/pb-logo.svg"
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      MapleStory Music
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link as={NavLink} exact to="/" onClick={onNavLinkClick}>
          Home
        </Nav.Link>
        <Nav.Link as={NavLink} exact to="/stats" onClick={onNavLinkClick}>
          Stats
        </Nav.Link>
        <Nav.Link as={NavLink} exact to="/about" onClick={onNavLinkClick}>
          About
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const Footer = (): ReactElement => {
  const buildHash = process.env.REACT_APP_BUILD_HASH ?? 'Dev';
  return (
    <div
      css={css`
        text-align: center;
        margin-bottom: 10px;
      `}
      className="footer"
    >
      <span>{`Build: ${buildHash}`}</span>
    </div>
  );
};

const Main = (): ReactElement => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/stats" component={Stats} />
      <Route path="/about" component={About} />
    </Switch>
  </main>
);

const Home = (): ReactElement => (
  <div className="App">
    <HomePage />
  </div>
);

const About = (): ReactElement => (
  <div
    css={css`
      margin: 2% 3% 3% 3%;
    `}
    className="About"
  >
    <AboutPage />
  </div>
);

const Stats = (): ReactElement => (
  <div
    css={css`
      margin: 2% 3% 3% 3%;
    `}
    className="Stats"
  >
    <StatsPage />
  </div>
);

const App = (): ReactElement => (
  <DataSourceProvider>
    <Router history={history}>
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    </Router>
  </DataSourceProvider>
);

export default App;
