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
import { cloneDeep, isEmpty, omit, pick, unset } from 'lodash';

import { convertToFormData } from '@/components/Upstream/service';
import { transformLabelValueToKeyValue } from '@/helpers';
import { HOST_REWRITE_TYPE, SCHEME_REWRITE, URI_REWRITE_TYPE } from '@/pages/Stream/constants';

export const transformProxyRewrite2Plugin = (
  data: StreamModule.ProxyRewrite,
): StreamModule.ProxyRewrite => {
  const omitFieldsList: string[] = ['kvHeaders'];
  let headers: Record<string, string> = {};
  console.log('---------------');
  console.log(data);

  if (data.scheme !== 'http' && data.scheme !== 'https') {
    omitFieldsList.push('scheme');
  }

  if (data.method === '') {
    omitFieldsList.push('method');
  }

  (data.kvHeaders || []).forEach((kvHeader) => {
    if (kvHeader.key) {
      // support value to be an empty string, which means remove a header
      headers = {
        ...headers,
        [kvHeader.key]: kvHeader.value || '',
      };
    }
  });

  if (!isEmpty(headers)) {
    return omit(
      {
        ...data,
        headers,
      },
      omitFieldsList,
    );
  }

  return omit(data, omitFieldsList);
};

const transformProxyRewrite2Formdata = (pluginsData: any) => {
  const proxyRewriteData: StreamModule.ProxyRewrite = {
    scheme: SCHEME_REWRITE.KEEP,
  };
  let URIRewriteType = URI_REWRITE_TYPE.KEEP;
  let hostRewriteType = HOST_REWRITE_TYPE.KEEP;

  if (pluginsData) {
    if (pluginsData.regex_uri) {
      URIRewriteType = URI_REWRITE_TYPE.REGEXP;
    }

    if (pluginsData.uri && !pluginsData.regex_uri) {
      URIRewriteType = URI_REWRITE_TYPE.STATIC;
    }

    if (pluginsData.host) {
      hostRewriteType = HOST_REWRITE_TYPE.REWRITE;
    }

    Object.keys(pluginsData).forEach((key) => {
      switch (key) {
        case 'scheme':
          proxyRewriteData[key] =
            pluginsData[key] === SCHEME_REWRITE.HTTP || pluginsData[key] === SCHEME_REWRITE.HTTPS
              ? pluginsData[key]
              : SCHEME_REWRITE.KEEP;
          break;
        case 'uri':
        case 'regex_uri':
        case 'host':
        case 'method':
          proxyRewriteData[key] = pluginsData[key];
          break;
        case 'headers':
          Object.keys(pluginsData[key]).forEach((headerKey) => {
            proxyRewriteData.kvHeaders = [
              ...(proxyRewriteData.kvHeaders || []),
              {
                key: headerKey,
                value: pluginsData[key][headerKey],
              },
            ];
          });
          break;
        default:
          break;
      }
    });
  }

  return {
    proxyRewriteData,
    URIRewriteType,
    hostRewriteType,
  };
};

// Transform Stream data then sent to API
export const transformStepData = ({
  form1Data,
  form2Data,
  // advancedMatchingRules,
  step3Data,
}: StreamModule.RequestData) => {
  // const { custom_normal_labels, custom_version_label, service_id = '' } = form1Data;
  const { service_id = '' } = form1Data;

  /*
  let redirect: StreamModule.Redirect = {};
  const proxyRewriteFormData: StreamModule.ProxyRewrite = form1Data.proxyRewrite;
  const proxyRewriteConfig = transformProxyRewrite2Plugin(proxyRewriteFormData);
  */

  const step3DataCloned = cloneDeep(step3Data);
  /*
  if (form1Data.redirectOption === 'disabled') {
    step3DataCloned.plugins = omit(step3Data.plugins, ['redirect']);
  } else if (form1Data.redirectOption === 'forceHttps') {
    redirect = { http_to_https: true };
  } else if (form1Data.redirectURI !== '') {
    redirect = {
      ret_code: form1Data.ret_code,
      uri: form1Data.redirectURI,
    };
  }

  const labels: Record<string, string> = {};
  transformLabelValueToKeyValue(custom_normal_labels).forEach(({ labelKey, labelValue }) => {
    labels[labelKey] = labelValue;
  });

  if (custom_version_label) {
    labels.API_VERSION = custom_version_label;
  }
  */
  const data: Partial<StreamModule.Body> = {
    ...form1Data,
    // labels,
    ...step3DataCloned,

    // @ts-ignore
    // methods: form1Data.methods.includes('ALL') ? [] : form1Data.methods,
    // status: Number(form1Data.status),
  };


  if (form2Data) {
    /**
     * Due to convertToRequestData under the Upstream component,
     * if upstream_id === Custom or None, it will be omitted.
     * So upstream_id here mush be a valid Upstream ID from API.
     */
    if (form2Data.upstream_id) {
      data.upstream_id = form2Data.upstream_id;
    } else {
      data.upstream = form2Data;
    }

    // Remove some of the frontend custom variables
    return omit(data, [
      'custom_version_label',
      'custom_normal_labels',
      'advancedMatchingRules',
      'upstreamHostList',
      'upstreamPath',
      'timeout',
      'redirectURI',
      'ret_code',
      'redirectOption',
      'URIRewriteType',
      'hostRewriteType',
      'proxyRewrite',
      service_id.length === 0 ? 'service_id' : '',
      !Object.keys(data.plugins || {}).length ? 'plugins' : '',
      // !Object.keys(data.script || {}).length ? 'script' : '',
      // form1Data.hosts?.filter(Boolean).length === 0 ? 'hosts' : '',
      // form1Data.redirectOption === 'disabled' ? 'redirect' : '',
      // data.remote_addrs?.filter(Boolean).length === 0 ? 'remote_addrs' : '',
      step3DataCloned.plugin_config_id === '' ? 'plugin_config_id' : '',
      // data.vars?.length ? '' : 'vars',
    ]);
  }

  return pick(data, [
    'name',
    'desc',
    'priority',
    'methods',
    'redirect',
    'plugins',
    'labels',
    'enable_websocket',
    data.uri ? 'uri' : 'uris',
    data.vars?.length ? 'vars' : '',
    service_id.length !== 0 ? 'service_id' : '',
    data.hosts?.filter(Boolean).length !== 0 ? 'hosts' : '',
    data.remote_addrs?.filter(Boolean).length !== 0 ? 'remote_addrs' : '',
    data.host ? 'host' : '',
    data.remote_addr ? 'remote_addr' : '',
    data.plugin_config_id ? 'plugin_config_id' : '',
  ]);
};

const transformVarsToRules = (data: StreamModule.VarTuple[] = []): StreamModule.MatchingRule[] =>
  data.map((varTuple) => {
    const key = varTuple[0];
    const reverse = varTuple[1] === '!';
    const operator = varTuple[1] === '!' ? varTuple[2] : varTuple[1];
    const value = varTuple[varTuple.length - 1];

    let position: string;
    let name: string;
    const regex = new RegExp('^(cookie|http|arg|post_arg)_.+');
    if (regex.test(key)) {
      [, position, name] = key.split(/^(cookie|http|arg|post_arg)_/);
    } else {
      position = 'buildin';
      name = key;
    }
    return {
      position: position as StreamModule.VarPosition,
      name,
      value: typeof value === 'object' ? JSON.stringify(value) : value,
      reverse,
      operator,
      key: Math.random().toString(36).slice(2),
    };
  });

export const transformUpstreamNodes = (
  nodes: Record<string, number> = {},
): StreamModule.UpstreamHost[] => {
  const data: StreamModule.UpstreamHost[] = [];
  Object.entries(nodes).forEach(([k, v]) => {
    const [host, port] = k.split(':');
    data.push({ host, port: Number(port), weight: Number(v) });
  });
  if (data.length === 0) {
    data.push({} as StreamModule.UpstreamHost);
  }
  return data;
};

// Transform response's data
export const transformStreamData = (data: StreamModule.Body) => {
  const {
    id,
    server_addr,
    server_port,
    name,
    desc,
    labels = {},
    methods = [],
    uris,
    uri,
    hosts,
    host,
    remote_addrs,
    remote_addr,
    vars = [],
    status,
    upstream,
    upstream_id,
    service_id = '',
    priority = 0,
    enable_websocket,
  } = data;

  const form1Data: Partial<StreamModule.Form1Data> = {
    // name,
    id,
    server_addr,
    server_port,
    // desc,
    // status,
    // hosts: hosts || (host && [host]) || [''],
    // uris: uris || (uri && [uri]) || [],
    // remote_addrs: remote_addrs || (remote_addr && [remote_addr]) || [''],
    // NOTE: API_VERSION is a system label
    // custom_version_label: labels.API_VERSION || '',
    /*
    custom_normal_labels: Object.keys(labels)
      .filter((item) => item !== 'API_VERSION')
      .map((key) => `${key}:${labels[key]}`),
    */
    // @ts-ignore
    // methods: methods.length ? methods : ['ALL'],
    // priority,
    // enable_websocket,
    service_id,
  };

  const redirect = data.plugins?.redirect || {};
  if (redirect?.http_to_https) {
    form1Data.redirectOption = 'forceHttps';
  } else if (redirect?.uri) {
    form1Data.redirectOption = 'customRedirect';
    form1Data.ret_code = redirect?.ret_code;
    form1Data.redirectURI = redirect?.uri;
  } else {
    form1Data.redirectOption = 'disabled';
  }

  const proxyRewrite = data.plugins ? data.plugins['proxy-rewrite'] : {};
  const { proxyRewriteData, URIRewriteType, hostRewriteType } = transformProxyRewrite2Formdata(
    proxyRewrite,
  );
  form1Data.proxyRewrite = proxyRewriteData;
  form1Data.URIRewriteType = URIRewriteType;
  form1Data.hostRewriteType = hostRewriteType;

  const advancedMatchingRules: StreamModule.MatchingRule[] = transformVarsToRules(vars);

  if (upstream && Object.keys(upstream).length) {
    upstream.upstream_id = 'Custom';
  }

  const form2Data: UpstreamComponent.ResponseData = convertToFormData(upstream) || {
    upstream_id: upstream_id || 'None',
  };

  const { plugins, script, plugin_config_id = '' } = data;

  const step3Data: StreamModule.Step3Data = {
    plugins,
    script,
    plugin_config_id,
  };

  return {
    form1Data,
    form2Data,
    step3Data,
    advancedMatchingRules,
  };
};