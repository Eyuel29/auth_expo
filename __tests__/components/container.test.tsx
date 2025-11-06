import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Container } from '@/components/container';

describe('Container Component', () => {
  it('should render children correctly', () => {
    const { getByText } = render(
      <Container>
        <Text>Test Content</Text>
      </Container>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <Container>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Container>
    );

    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });

  it('should render nested components', () => {
    const { getByText, getByTestId } = render(
      <Container>
        <View testID="nested-view">
          <Text>Nested Content</Text>
        </View>
      </Container>
    );

    expect(getByTestId('nested-view')).toBeTruthy();
    expect(getByText('Nested Content')).toBeTruthy();
  });

  it('should handle empty children gracefully', () => {
    const { root } = render(<Container>{null}</Container>);
    expect(root).toBeTruthy();
  });
});
