import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { SHOW_MODAL } from '~/actions/modal';
import { ReverseDNSPage } from '~/linodes/linode/networking/layouts/ReverseDNSPage';
import { testLinode } from '@/data/linodes';
import { state } from '@/data';
import { expectRequest } from '@/common';

const { linodes } = state.api;

describe('linodes/linode/networking/layouts/ReverseDNSPage', () => {
  const sandbox = sinon.sandbox.create();
  const dispatch = sandbox.stub();

  afterEach(() => {
    dispatch.reset();
    sandbox.restore();
  });

  it('renders ips', () => {
    const { _ips } = testLinode;
    const ips = [..._ips.ipv4.public, ..._ips.ipv6.addresses];
    const addresses = ips.map(({ address }) => address);
    const page = mount(
      <ReverseDNSPage
        dispatch={dispatch}
        linodes={linodes}
        params={{ linodeLabel: testLinode.label }}
      />
    );

    const rows = page.find('.SecondaryTable-row');
    expect(rows.length).to.equal(ips.length);
    for (let i = 0; i < rows.length; i++) {
      const row = rows.at(i);
      const columns = row.find('.SecondaryTable-column');
      expect(columns.length).to.equal(3);

      const addressIndex = addresses.indexOf(columns.at(0).text());
      expect(addressIndex).to.not.equal(-1);
      const ip = ips[addressIndex];
      expect(columns.at(1).text()).to.equal(ip.rdns);
    }
  });

  it('resets the rdns', async () => {
    const page = mount(
      <ReverseDNSPage
        dispatch={dispatch}
        linodes={linodes}
        params={{ linodeLabel: testLinode.label }}
      />
    );

    const row = page.find('.SecondaryTable-row').at(0);
    const address = row.find('.SecondaryTable-column').at(0).text();
    await row.find('#reset-0').props().onClick();
    expect(dispatch.callCount).to.equal(1);
    const fn = dispatch.firstCall.args[0];
    await expectRequest(fn, `/linode/instances/${testLinode.id}/ips/${address}`, {
      method: 'PUT',
      body: { rdns: null },
    });
  });

  it('opens the edit modal', async () => {
    const page = mount(
      <ReverseDNSPage
        dispatch={dispatch}
        linodes={linodes}
        params={{ linodeLabel: testLinode.label }}
      />
    );

    const row = page.find('.SecondaryTable-row').at(0);
    row.find('#edit-0').props().onClick();
    expect(dispatch.callCount).to.equal(1);
    expect(dispatch.firstCall.args[0].type).to.equal(SHOW_MODAL);
  });
});
