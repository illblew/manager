import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { distros } from '~/assets';
import { testDistros } from '~/../test/data';
import DistroVendor from '~/linodes/components/DistroVendor';

describe('linodes/components/DistroVendor', () => {
  const sandbox = sinon.sandbox.create();
  afterEach(() => {
    sandbox.restore();
  });

  const vendor = {
    name: 'Debian',
    versions: [
      testDistros.distro_1237,
      testDistros.distro_1236,
      testDistros.distro_1238,
    ],
  };

  it('renders the selected distro name', () => {
    const dv = shallow(<DistroVendor vendor={vendor} />);
    expect(dv.find('h3').text()).to.equal('Debian 8.1');
  });

  it('renders the vendor logo', () => {
    const dv = shallow(<DistroVendor vendor={vendor} />);
    expect(dv.find('img').props())
      .to.have.property('src')
      .that.equals(distros.Debian);
  });

  it('renders a dropdown with all of the versions', () => {
    const dv = shallow(<DistroVendor vendor={vendor} />);
    expect(dv.find('.dropdown-item').length).to.equal(3);
    expect(dv.find('.dropdown-item').at(0).text())
      .to.equal(vendor.versions[0].label);
    expect(dv.find('.dropdown-item').at(1).text())
      .to.equal(vendor.versions[1].label);
    expect(dv.find('.dropdown-item').at(2).text())
      .to.equal(vendor.versions[2].label);
  });

  it('invokes the selectedVersion function when clicked', () => {
    const onClick = sandbox.spy();
    const dv = shallow(
      <DistroVendor
        vendor={vendor}
        onClick={onClick}
      />
    );
    dv.find('div').first().simulate('click');
    expect(onClick.calledOnce).to.equal(true);
    expect(onClick.calledWith(vendor.versions[0])).to.equal(true);
  });

  it('invokes the selectedVersion function with the correct version', () => {
    const onClick = sandbox.spy();
    const dv = shallow(
      <DistroVendor
        vendor={vendor}
        onClick={onClick}
      />
    );
    dv.find('.dropdown-item').at(2).simulate('click', {
      preventDefault: () => {},
      stopPropagation: () => {},
    });
    onClick.reset();
    dv.find('div').first().simulate('click');
    expect(onClick.calledOnce).to.equal(true);
    expect(onClick.calledWith(vendor.versions[2])).to.equal(true);
  });
});