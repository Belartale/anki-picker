// Core
import React, { FC } from 'react';

// Components
import { ErrorBoundary } from '../../components';

// Styles
import { Container } from './styles';

const Root: FC = () => {
    return (
        <Container>
            Root
        </Container>
    );
};

export default () => (
    <ErrorBoundary>
        <Root />
    </ErrorBoundary>
);
