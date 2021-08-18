import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import Header from '../components/header';

export default function MyApp({ Component, pageProps }) {
    return (
        <Container>
            <Header />
            <Component {...pageProps} />
        </Container>
    );
}