/*eslint-disable*/
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Col, Input, InputNumber, notification, Row, Select } from 'antd';
import Form from 'antd/es/form';
import type { FC } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useIntl } from 'umi';

import PanelSection from '@/components/PanelSection';

import { fetchServiceList } from '../../service';

const MetaViewContext = createContext<StreamModule.Step1PassProps>({
  form: null,
  // advancedMatchingRules: [],
});

const Id: FC = () => {
  const { formatMessage } = useIntl();
  const { isEdit } = useContext(MetaViewContext);

  if (!isEdit) {
    return null;
  }

  return (
    <Form.Item label={formatMessage({ id: 'component.global.id' })}>
      <Row>
        <Col span={10}>
          <Form.Item noStyle name="id">
            <Input disabled={true} />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  );
};

const ServerAddr: FC = () => {
  const { formatMessage } = useIntl();
  const { disabled } = useContext(MetaViewContext);

  return (
    <Form.Item 
      label={formatMessage({ id: 'page.stream.server_addr' })}
      tooltip={formatMessage({ id: 'page.stream.fields.server_addr.tooltip' })}
    >
      <Row>
        <Col span={10}>
          {/* THE 'name' is the FIELD name send to API server */}
          <Form.Item noStyle name="server_addr">
            <Input
              placeholder={formatMessage({ id: 'page.stream.input.server_addr.placeholder' })}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  );
};

const ServerPort: FC = () => {
  const { formatMessage } = useIntl();
  const { disabled } = useContext(MetaViewContext);

  return (
    <Form.Item
      label={formatMessage({ id: 'page.stream.server_port' })}
      tooltip={formatMessage({ id: 'page.stream.fields.server_port.tooltip' })}
      required
    >
      <Row>
        <Col span={10}>
          <Form.Item
            noStyle
            name="server_port"
          >
            <InputNumber disabled={disabled} min={1} max={65535} />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  );
};

const Description: FC = () => {
  const { formatMessage } = useIntl();
  const { disabled } = useContext(MetaViewContext);

  return (
    <Form.Item label={formatMessage({ id: 'component.global.description' })}>
      <Row>
        <Col span={10}>
          <Form.Item noStyle name="desc">
            <Input.TextArea
              placeholder={formatMessage({ id: 'page.stream.input.placeholder.description' })}
              disabled={disabled}
              showCount
              maxLength={256}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  );
};

const ServiceSelector: FC = () => {
  const { formatMessage } = useIntl();
  const { disabled, upstreamForm } = useContext(MetaViewContext);
  const [serviceList, setServiceList] = useState<{ data: ServiceModule.ResponseBody[] }>();

  useEffect(() => {
    fetchServiceList().then(setServiceList);
  }, []);

  return (
    <>
      <Form.Item
        label={formatMessage({ id: 'page.route.service' })}
        tooltip={formatMessage({ id: 'page.route.fields.service_id.tooltip' })}
      >
        <Row>
          <Col span={5}>
            <Form.Item noStyle name="service_id">
              <Select
                showSearch
                disabled={disabled}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {/* TODO: value === '' means  no service_id select, need to find a better way */}
                <Select.Option value="" key={Math.random().toString(36).substring(7)}>
                  {formatMessage({ id: 'page.route.service.none' })}
                </Select.Option>
                {serviceList?.data?.map((item) => {
                  return (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) => {
          // route with redirect plugin can be edit without service and upstream
          if (next.redirectOption === 'customRedirect') {
            return false;
          }
          if (next.service_id === '') {
            const upstream_id = upstreamForm?.getFieldValue('upstream_id');
            if (upstream_id === 'None') {
              notification.warning({
                message: formatMessage({ id: 'page.route.fields.service_id.invalid' }),
                description: formatMessage({ id: 'page.route.fields.service_id.without-upstream' }),
              });
            }
          }
          return prev.service_id !== next.service_id;
        }}
      >
        <span />
      </Form.Item>
    </>
  );
};

const MetaView: React.FC<StreamModule.Step1PassProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <PanelSection title={formatMessage({ id: 'page.stream.panelSection.title.nameDescription' })}>
      <MetaViewContext.Provider value={props}>
        <Id />
        <ServerAddr />
        <ServerPort />
        <Description />

        <ServiceSelector />

      </MetaViewContext.Provider>
    </PanelSection>
  );
};

export default MetaView;
