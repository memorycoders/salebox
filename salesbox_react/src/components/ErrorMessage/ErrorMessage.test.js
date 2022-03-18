import React from 'react';
import { shallow } from 'enzyme';
import ErrorMessage from './ErrorMessage';

describe('components/commmon/ErrorMessage', () => {
  it('should show default message', () => {
    const cmp = shallow(<ErrorMessage />);
    expect(cmp.text()).toEqual('Error');
  });

  it('should show supplied error message', () => {
    const mockErr = new Error('mock error');
    const cmp = shallow(<ErrorMessage error={mockErr} />);
    expect(cmp.text()).toEqual('mock error');
  });
});
