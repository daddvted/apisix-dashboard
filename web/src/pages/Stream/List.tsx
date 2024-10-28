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
import { DownOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useThrottleFn } from 'ahooks';
import {
  Button,
  Dropdown,
  Menu,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { omit } from 'lodash';
import type { ReactNode } from 'react';
import React, { useRef, useState } from 'react';
import { history, useIntl } from 'umi';

import { RawDataEditor } from '@/components/RawDataEditor';
import { DELETE_FIELDS } from '@/constants';
import { timestampToLocaleString } from '@/helpers';
import usePagination from '@/hooks/usePagination';
import DataLoaderImport from '@/pages/Stream/components/DataLoader/Import';

import { DebugDrawView } from './components/DebugViews';
import { create, fetchList, remove, update, updateRouteStatus } from './service';

//const { OptGroup, Option } = Select;

const Page: React.FC = () => {
  const ref = useRef<ActionType>();
  const { formatMessage } = useIntl();

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [showImportDrawer, setShowImportDrawer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rawData, setRawData] = useState<Record<string, any>>({});
  const [id, setId] = useState('');
  const [editorMode, setEditorMode] = useState<'create' | 'update'>('create');
  const { paginationConfig, savePageList, checkPageList } = usePagination();
  const [debugDrawVisible, setDebugDrawVisible] = useState(false);

  // REMOVE LATER
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (currentSelectKeys: string[]) => {
      setSelectedRowKeys(currentSelectKeys);
    },
    preserveSelectedRowKeys: true,
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
    defaultSelectedRowKeys: [1],
  };

  const handleTableActionSuccessResponse = (msgTip: string) => {
    notification.success({
      message: msgTip,
    });

    checkPageList(ref);
  };

  const ListToolbar = () => {
    const tools = [
      {
        name: formatMessage({ id: 'page.stream.pluginTemplateConfig' }),
        icon: <PlusOutlined />,
        onClick: () => {
          history.push('/plugin-template/list');
        },
      },
      {
        name: formatMessage({ id: 'component.global.data.editor' }),
        icon: <PlusOutlined />,
        onClick: () => {
          setVisible(true);
          setEditorMode('create');
          setRawData({});
        },
      },
      {
        name: formatMessage({ id: 'page.stream.data_loader.import' }),
        icon: <ImportOutlined />,
        onClick: () => {
          setShowImportDrawer(true);
        },
      },
    ];

    return (
      <Dropdown
        overlay={
          <Menu>
            {tools.map((item) => (
              <Menu.Item key={item.name} onClick={item.onClick}>
                {item.icon}
                {item.name}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <Button type="dashed">
          <DownOutlined /> {formatMessage({ id: 'menu.advanced-feature' })}
        </Button>
      </Dropdown>
    );
  };

  const RecordActionDropdown: React.FC<{ record: any }> = ({ record }) => {
    const tools: {
      name: string;
      onClick: () => void;
      icon?: ReactNode;
    }[] = [
      {
        name: formatMessage({ id: 'component.global.view' }),
        onClick: () => {
          setId(record.id);
          setRawData(omit(record, DELETE_FIELDS));
          setVisible(true);
          setEditorMode('update');
        },
      },
      /*
      {
        name: formatMessage({ id: 'component.global.duplicate' }),
        onClick: () => {
          history.push(`/streams/${record.id}/duplicate`);
        },
      },
      */
      {
        name: formatMessage({ id: 'component.global.delete' }),
        onClick: () => {
          Modal.confirm({
            type: 'warning',
            title: formatMessage({ id: 'component.global.popconfirm.title.delete' }),
            content: (
              <>
                {formatMessage({ id: 'component.global.name' })} - {record.name}
                <br />
                ID - {record.id}
              </>
            ),
            onOk: () => {
              return remove(record.id!).then(() => {
                handleTableActionSuccessResponse(
                  `${formatMessage({ id: 'component.global.delete' })} ${formatMessage({
                    id: 'menu.streams',
                  })} ${formatMessage({ id: 'component.status.success' })}`,
                );
              });
            },
          });
        },
      },
    ];

    return (
      <Dropdown
        overlay={
          <Menu>
            {tools.map((item) => (
              <Menu.Item key={item.name} onClick={item.onClick}>
                {item.icon && item.icon}
                {item.name}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <Button type="dashed">
          <DownOutlined />
          {formatMessage({ id: 'menu.more' })}
        </Button>
      </Dropdown>
    );
  };

  const columns: ProColumns<StreamModule.ResponseBody>[] = [
    {
      title: formatMessage({ id: 'component.global.id' }),
      dataIndex: 'id',
      width: 200,
      hideInSearch: true
    },
    {
      title: formatMessage({ id: 'page.stream.server_addr' }),
      dataIndex: 'server_addr',
      width: 150,
    },
    {
      title: formatMessage({ id: 'page.stream.server_port' }),
      dataIndex: 'server_port',
      width: 150,
    },
    {
      title: formatMessage({ id: 'component.global.updateTime' }),
      dataIndex: 'update_time',
      hideInSearch: true,
      width: 200,
      render: (text) => timestampToLocaleString(text as number),
    },
    {
      title: formatMessage({ id: 'component.global.operation' }),
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      width: 240,
      render: (_, record) => (
        <>
          <Space align="baseline">
            <Button type="primary" onClick={() => history.push(`/streams/${record.id}/edit`)}>
              {formatMessage({ id: 'component.global.edit' })}
            </Button>
            <RecordActionDropdown record={record} />
          </Space>
        </>
      ),
    },
    {
      title: formatMessage({ id: 'menu.plugin' }),
      dataIndex: 'plugins',
      width: 240,
      render: (_, record) => {
        const plugins = record.plugins || {};
        return Object.keys(plugins).length > 0
          ? Object.keys(plugins).map((key) => <Tag key={key}>{key}</Tag>)
          : '-';
      },
    },
  ];

  return (
    <PageHeaderWrapper
      title={formatMessage({ id: 'page.stream.list' })}
      content={formatMessage({ id: 'page.stream.list.description' })}
    >
      <ProTable<StreamModule.ResponseBody>
        actionRef={ref}
        rowKey="id"
        columns={columns}
        rowSelection={rowSelection}
        tableAlertRender={() => (
          <Space size={24}>
            <span>
              {formatMessage({ id: 'page.stream.chosen' })} {selectedRowKeys.length}{' '}
              {formatMessage({ id: 'page.stream.item' })}
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Button
                onClick={async () => {
                  await remove(selectedRowKeys).then(() => {
                    handleTableActionSuccessResponse(
                      `${formatMessage({ id: 'component.global.delete.routes.success' })}`,
                    );
                  });
                  ref.current?.reloadAndRest?.();
                }}
              >
                {formatMessage({ id: 'page.stream.batchDeletion' })}
              </Button>
            </Space>
          );
        }}
        request={fetchList}
        pagination={{
          onChange: (page, pageSize?) => savePageList(page, pageSize),
          pageSize: paginationConfig.pageSize,
          current: paginationConfig.current,
        }}
        search={{
          searchText: formatMessage({ id: 'component.global.search' }),
          resetText: formatMessage({ id: 'component.global.reset' }),
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => history.push(`/streams/create`)}>
            <PlusOutlined />
            {formatMessage({ id: 'component.global.create' })}
          </Button>,
          <ListToolbar />,
        ]}
        scroll={{ x: 1300 }}
      />
      <DebugDrawView
        visible={debugDrawVisible}
        onClose={() => {
          setDebugDrawVisible(false);
        }}
      />
      <RawDataEditor
        visible={visible}
        type="route"
        readonly={false}
        data={rawData}
        onClose={() => {
          setVisible(false);
        }}
        onSubmit={(data: any) => {
          (editorMode === 'create' ? create(data, 'RawData') : update(id, data, 'RawData')).then(
            () => {
              setVisible(false);
              ref.current?.reload();
            },
          );
        }}
      />
      {showImportDrawer && (
        <DataLoaderImport
          onClose={(finish) => {
            if (finish) checkPageList(ref);
            setShowImportDrawer(false);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default Page;
