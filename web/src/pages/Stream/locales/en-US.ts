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
export default {
  'page.stream.server_addr': 'Server Address',
  'page.stream.server_port': 'Server Port',
  'page.stream.button.returnList': 'Goto List',
  'page.stream.button.send': 'Send',
  'page.stream.onlineDebug': 'Online Debug',
  'page.stream.pluginTemplateConfig': 'Plugin Template Config',

  'page.stream.parameterPosition': 'Parameter Position',
  'page.stream.httpRequestHeader': 'HTTP Request Header',
  'page.stream.requestParameter': 'Request Parameter',
  'page.stream.postRequestParameter': 'POST Request Parameter',
  'page.stream.builtinParameter': 'Built-in Parameter',
  'page.stream.parameterName': 'Parameter Name',
  'page.stream.operationalCharacter': 'Operational Character',
  'page.stream.equal': 'Equal(==)',
  'page.stream.unequal': 'Unequal(~=)',
  'page.stream.greaterThan': 'Greater Than(>)',
  'page.stream.lessThan': 'Less Than(<)',
  'page.stream.regexMatch': 'Regex Match(~~)',
  'page.stream.caseInsensitiveRegexMatch': 'Case insensitive regular match(~*)',
  'page.stream.in': 'IN',
  'page.stream.has': 'HAS',
  'page.stream.reverse': 'Reverse the result(!)',
  'page.stream.rule': 'Rule',
  'page.stream.httpHeaderName': 'HTTP Request Header Name',
  'page.stream.service': 'Service',
  'page.stream.instructions': 'Instructions',
  'page.stream.import': 'Import',
  'page.stream.createRoute': 'Create Route',
  'page.stream.editRoute': 'Configure Route',
  'page.stream.batchDeletion': 'BatchDeletion Routes',
  'page.stream.unSelect': 'Unselect',
  'page.stream.item': 'items',
  'page.stream.chosen': 'chosen',

  'page.stream.input.placeholder.parameterNameHttpHeader': 'Request header name, for example: HOST',
  'page.stream.input.placeholder.parameterNameRequestParameter': 'Parameter name, for example: id',
  'page.stream.input.placeholder.requestUrl': 'please input the valid request URL',
  'page.stream.input.placeholder.paramKey': 'Param Key',
  'page.stream.input.placeholder.paramValue': 'Param Value',
  'page.stream.input.placeholder.paramType': 'Param Type',

  'page.stream.form.itemRulesRequiredMessage.parameterName':
    'Only letters and Numbers are supported, and can only begin with letters',
  'page.stream.value': 'Parameter Value',
  'page.stream.panelSection.title.advancedMatchRule': 'Advanced Routing Matching Conditions',

  'page.stream.panelSection.title.nameDescription': 'Name And Description',
  'page.stream.form.itemRulesPatternMessage.apiNameRule': 'Maximum length should be of 100 only',

  'page.stream.panelSection.title.requestConfigBasicDefine': 'Request Basic Define',
  'page.stream.form.itemLabel.httpMethod': 'HTTP Method',
  'page.stream.form.itemLabel.scheme': 'Scheme',
  'page.stream.form.itemLabel.priority': 'Priority',
  'page.stream.form.itemLabel.redirect': 'Redirect',
  'page.stream.select.option.enableHttps': 'Enable HTTPS',
  'page.stream.select.option.configCustom': 'Custom',
  'page.stream.select.option.forbidden': 'Forbidden',
  'page.stream.form.itemLabel.redirectCustom': 'Custom Redirect',
  'page.stream.input.placeholder.redirectCustom': 'For example: /foo/index.html',
  'page.stream.select.option.redirect301': '301(Permanent Redirect)',
  'page.stream.select.option.redirect302': '302(Temporary Redirect)',
  'page.stream.form.itemLabel.username': 'Username',
  'page.stream.form.itemLabel.password': 'Password',
  'page.stream.form.itemLabel.token': 'Token',
  'page.stream.form.itemLabel.apikey': 'Apikey',

  'page.stream.form.itemExtraMessage.domain':
    'Domain Name or IP, support for generic Domain Name, for example: *.test.com',
  'page.stream.form.itemRulesPatternMessage.domain':
    'Only letters, numbers, -,_ and * are supported, but * needs to be at the beginning.',
  'page.stream.form.itemExtraMessage1.path':
    'HTTP Request path, for example: /foo/index.html, supports request path prefix /foo/* ; /* represents all paths',
  'page.stream.form.itemRulesPatternMessage.remoteAddrs':
    'Please enter a valid IP address, for example: 192.168.1.101, 192.168.1.0/24, ::1, fe80::1, fe80::1/64',
  'page.stream.form.itemExtraMessage1.remoteAddrs':
    'Client IP, for example: 192.168.1.101, 192.168.1.0/24, ::1, fe80::1, fe80::1/64',

  'page.stream.httpAction': 'Action',
  'page.stream.httpOverrideOrCreate': 'Override/Create',
  'page.stream.panelSection.title.httpOverrideRequestHeader': 'Override HTTP request header',
  'page.stream.status': 'Status',
  'page.stream.groupName': 'GroupName',
  'page.stream.offline': 'Offline',
  'page.stream.publish': 'Publish',
  'page.stream.published': 'Published',
  'page.stream.unpublished': 'UnPublished',

  'page.stream.select.option.inputManually': 'Input Manually',
  'page.stream.select.option.methodRewriteNone': 'Not modify',
  'page.stream.form.itemLabel.domainNameOrIp': 'Domain Name/IP',
  'page.stream.form.itemExtraMessage.domainNameOrIp':
    'When using Domain Name, it will analysis the local: /etc/resolv.conf by default',
  'page.stream.portNumber': 'Port Number',
  'page.stream.weight': 'Weight',
  'page.stream.radio.staySame': 'Stay The Same',
  'page.stream.form.itemLabel.newPath': 'New Path',
  'page.stream.form.itemLabel.newHost': 'New Host',
  'page.stream.form.itemLabel.regex': 'Regexp',
  'page.stream.form.itemLabel.template': 'Template',
  'page.stream.form.itemLabel.URIRewriteType': 'URI Override',
  'page.stream.form.itemLabel.hostRewriteType': 'Host Override',
  'page.stream.form.itemLabel.methodRewrite': 'Method Override',
  'page.stream.form.itemLabel.redirectURI': 'Redirect URI',
  'page.stream.input.placeholder.newPath': 'For example: /foo/bar/index.html',

  'page.stream.steps.stepTitle.defineApiRequest': 'Define API Request',
  'page.stream.steps.stepTitle.defineApiBackendServe': 'Define API Backend Server',

  'page.stream.popconfirm.title.offline': 'Are you sure to offline this route?',
  'page.stream.radio.static': 'Static',
  'page.stream.radio.regex': 'Regex',
  'page.stream.form.itemLabel.from': 'From',
  'page.stream.form.itemHelp.status':
    'Whether a route can be used after it is created, the default value is false.',

  'page.stream.host': 'Host',
  'page.stream.path': 'Path',
  'page.stream.remoteAddrs': 'Remote Addrs',
  'page.stream.PanelSection.title.defineRequestParams': 'Define Request Parameters',
  'page.stream.PanelSection.title.responseResult': 'Response Result',
  'page.stream.debug.showResultAfterSendRequest': 'Show Result After Send Request',
  'page.stream.TabPane.queryParams': 'Query Params',
  'page.stream.TabPane.bodyParams': 'Body Params',
  'page.stream.TabPane.headerParams': 'Header Params',
  'page.stream.TabPane.authentication': 'Authentication',
  'page.stream.TabPane.response': 'Response',
  'page.stream.TabPane.header': 'Response Header',
  'page.stream.debugWithoutAuth': 'This request does not use any authorization.',
  'page.stream.button.exportOpenApi': 'Export OpenAPI',
  'page.stream.exportRoutesTips': 'Please choose the type of file you want to export',
  'page.stream.button.importOpenApi': 'Import OpenAPI',
  'page.stream.button.selectFile': 'Please Select File',
  'page.stream.list': 'Streams',
  'page.stream.panelSection.title.requestOverride': 'Request Override',
  'page.stream.form.itemLabel.headerRewrite': 'Header Override',
  'page.stream.tooltip.pluginOrchOnlySupportChrome': 'Plugin orchestration only supports Chrome.',
  'page.stream.tooltip.pluginOrchWithoutProxyRewrite':
    'Plugin orchestration mode cannot be used when request override is configured in Step 1.',
  'page.stream.tooltip.pluginOrchWithoutRedirect':
    'Plugin orchestration mode cannot be used when Redirect in Step 1 is selected to enable HTTPS.',

  'page.stream.tabs.normalMode': 'Normal',
  'page.stream.tabs.orchestration': 'Orchestration',

  'page.stream.list.description':
    'Stream is used to forward pre-allocated layer 4 ports of APISIX to backed layer 4 ports.',

  'page.stream.configuration.name.rules.required.description': 'Please enter the route name',
  'page.stream.configuration.name.placeholder': 'Please enter the route name',
  'page.stream.configuration.desc.tooltip': 'Please enter the description of the route',
  'page.stream.configuration.publish.tooltip':
    'Used to control whether a route is published to the gateway immediately after it is created',
  'page.stream.configuration.version.placeholder': 'Please enter the routing version number',
  'page.stream.configuration.version.tooltip': 'Version number of the route, e.g. V1',
  'page.stream.configuration.normal-labels.tooltip':
    'Add custom labels to routes that can be used for route grouping.',

  'page.stream.configuration.path.rules.required.description':
    'Please enter a valid HTTP request path',
  'page.stream.configuration.path.placeholder': 'Please enter the HTTP request path',
  'page.stream.configuration.remote_addrs.placeholder': 'Please enter the client address',
  'page.stream.configuration.host.placeholder': 'Please enter the HTTP request hostname',

  'page.stream.service.none': 'None',

  'page.stream.rule.create': 'Create Rule',
  'page.stream.rule.edit': 'Configure Rule',

  'page.stream.advanced-match.operator.sample.IN': 'Please enter an array, e.g ["1", "2"]',
  'page.stream.advanced-match.operator.sample.~~': 'Please enter a regular expression, e.g [a-z]+',
  'page.stream.fields.service_id.invalid': 'Please check the configuration of binding service',
  'page.stream.fields.service_id.without-upstream':
    'If you do not bind the service, you must set the Upstream (Step 2)',
  'page.stream.advanced-match.tooltip':
    'It supports route matching through request headers, request parameters and cookies, and can be applied to scenarios such as grayscale publishing and blue-green testing.',
  'page.stream.advanced-match.message': 'Tips',
  'page.stream.advanced-match.tips.requestParameter': 'Request Parameter：Query of the request URL',
  'page.stream.advanced-match.tips.postRequestParameter':
    'POST Request Parameter：Only support x-www-form-urlencoded form',
  'page.stream.advanced-match.tips.builtinParameter':
    'Build-in Parameter：Nginx internal parameters',

  'page.stream.fields.custom.redirectOption.tooltip': 'This is related to redirect plugin',
  'page.stream.fields.service_id.tooltip': 'Bind Service object to reuse their configuration.',
  'page.stream.fields.server_addr.tooltip': 'Default to APISIX Server IP',
  'page.stream.fields.server_port.tooltip': 'Specify pre-allocated layer 4 port',

  'page.stream.fields.vars.invalid': 'Please check the advanced match condition configuration',
  'page.stream.fields.vars.in.invalid':
    'When using the IN operator, enter the parameter values in array format.',

  'page.stream.data_loader.import': 'Import',
  'page.stream.data_loader.import_panel': 'Import data',
  'page.stream.data_loader.types.openapi3': 'OpenAPI 3',
  'page.stream.data_loader.types.openapi_legacy': 'OpenAPI 3 Legacy',
  'page.stream.data_loader.labels.loader_type': 'Data Loader Type',
  'page.stream.data_loader.labels.task_name': 'Task Name',
  'page.stream.data_loader.labels.upload': 'Upload',
  'page.stream.data_loader.labels.openapi3_merge_method': 'Merge HTTP Methods',
  'page.stream.data_loader.tips.select_type': 'Please select data loader',
  'page.stream.data_loader.tips.input_task_name': 'Please input import task name',
  'page.stream.data_loader.tips.click_upload': 'Click to Upload',
  'page.stream.data_loader.tips.openapi3_merge_method':
    'Whether to merge multiple HTTP methods in the OpenAPI path into a single route. When you have multiple HTTP methods in your path with different details configuration (e.g. securitySchema), you can turn off this option to generate them into multiple routes.',
};
