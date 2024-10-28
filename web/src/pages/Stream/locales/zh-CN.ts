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
  // global
  'page.stream.server_addr': '服务器地址',
  'page.stream.server_port': '服务器端口',
  'page.stream.parameterPosition': '参数位置',
  'page.stream.httpRequestHeader': 'HTTP 请求头',
  'page.stream.requestParameter': '请求参数',
  'page.stream.postRequestParameter': 'POST 请求参数',
  'page.stream.builtinParameter': '内置参数',
  'page.stream.parameterName': '参数名称',
  'page.stream.operationalCharacter': '运算符',
  'page.stream.equal': '等于（==）',
  'page.stream.unequal': '不等于（~=）',
  'page.stream.greaterThan': '大于（>）',
  'page.stream.lessThan': '小于（<）',
  'page.stream.regexMatch': '正则匹配（～～）',
  'page.stream.caseInsensitiveRegexMatch': '不区分大小写的正则匹配（~*）',
  'page.stream.in': 'IN',
  'page.stream.has': 'HAS',
  'page.stream.reverse': '非(!)',
  'page.stream.rule': '规则',
  'page.stream.host': '域名',
  'page.stream.path': '路径',
  'page.stream.remoteAddrs': '客户端地址',
  'page.stream.value': '参数值',
  'page.stream.httpHeaderName': 'HTTP 请求头名称',
  'page.stream.status': '状态',
  'page.stream.groupName': '分组名称',
  'page.stream.offline': '下线',
  'page.stream.publish': '发布',
  'page.stream.published': '已发布',
  'page.stream.unpublished': '未发布',
  'page.stream.onlineDebug': '在线调试',
  'page.stream.pluginTemplateConfig': '插件模版配置',
  'page.stream.service': '绑定服务',
  'page.stream.instructions': '说明',
  'page.stream.import': '导入',
  'page.stream.createRoute': '创建路由',
  'page.stream.editRoute': '编辑路由',
  'page.stream.batchDeletion': '批量删除路由',
  'page.stream.unSelect': '取消选择',
  'page.stream.item': '项',
  'page.stream.chosen': '已选择',

  // button
  'page.stream.button.returnList': '返回数据流列表',
  'page.stream.button.send': '发送请求',

  // input
  'page.stream.input.placeholder.parameterNameHttpHeader': '请求头名称，例如：HOST',
  'page.stream.input.placeholder.parameterNameRequestParameter': '参数名称，例如：id',
  'page.stream.input.placeholder.redirectCustom': '例如：/foo/index.html',
  'page.stream.input.placeholder.requestUrl': '请输入合法的请求地址',
  'page.stream.input.placeholder.paramKey': '参数名称',
  'page.stream.input.placeholder.paramType': '参数类型',
  'page.stream.input.placeholder.paramValue': '参数值',
  'page.stream.input.server_addr.placeholder': '请输入绑定的服务端地址',
  'page.stream.input.placeholder.serverPort': '请输需要绑定的服务端端口（提前预留）',
  // form
  'page.stream.form.itemRulesRequiredMessage.parameterName': '仅支持字母和数字，且只能以字母开头',
  'page.stream.form.itemRulesPatternMessage.apiNameRule': '最大长度应仅为 100',
  'page.stream.form.itemLabel.httpMethod': 'HTTP 方法',
  'page.stream.form.itemLabel.scheme': '协议',
  'page.stream.form.itemLabel.priority': '优先级',
  'page.stream.form.itemLabel.redirect': '重定向',
  'page.stream.form.itemLabel.redirectCustom': '自定义重定向',
  'page.stream.form.itemLabel.URIRewriteType': '路径改写',
  'page.stream.form.itemLabel.hostRewriteType': '域名改写',
  'page.stream.form.itemLabel.methodRewrite': 'HTTP 方法改写',
  'page.stream.form.itemLabel.headerRewrite': '请求头改写',
  'page.stream.form.itemLabel.redirectURI': '重定向路径',
  'page.stream.form.itemExtraMessage.domain': '路由匹配的域名列表。支持泛域名，如：*.test.com',
  'page.stream.form.itemRulesPatternMessage.domain':
    '仅支持字母、数字、-、_和 *，但 * 需要在开头位置。',
  'page.stream.form.itemExtraMessage1.path':
    'HTTP 请求路径，如 /foo/index.html，支持请求路径前缀 /foo/*。/* 代表所有路径',
  'page.stream.form.itemExtraMessage1.remoteAddrs':
    '客户端与服务器握手时 IP，即客户端 IP，例如：192.168.1.101，192.168.1.0/24，::1，fe80::1，fe80::1/64',
  'page.stream.form.itemRulesPatternMessage.remoteAddrs':
    '请输入合法的 IP 地址，例如：192.168.1.101，192.168.1.0/24，::1，fe80::1，fe80::1/64',
  'page.stream.form.itemLabel.username': '用户名',
  'page.stream.form.itemLabel.password': '密 码',
  'page.stream.form.itemLabel.token': 'Token',
  'page.stream.form.itemLabel.apikey': 'Apikey',

  // select
  'page.stream.select.option.enableHttps': '启用 HTTPS',
  'page.stream.select.option.configCustom': '自定义',
  'page.stream.select.option.forbidden': '禁用',
  'page.stream.select.option.redirect301': '301（永久重定向）',
  'page.stream.select.option.redirect302': '302（临时重定向）',
  'page.stream.select.option.inputManually': '手动填写',
  'page.stream.select.option.methodRewriteNone': '不改写',

  // steps
  'page.stream.steps.stepTitle.defineApiRequest': '设置数据流信息',
  'page.stream.steps.stepTitle.defineApiBackendServe': '设置上游服务',

  // panelSection
  'page.stream.panelSection.title.nameDescription': '基本信息',
  'page.stream.panelSection.title.httpOverrideRequestHeader': 'HTTP 请求头改写',
  'page.stream.panelSection.title.requestOverride': '请求改写',
  'page.stream.panelSection.title.requestConfigBasicDefine': '匹配条件',
  'page.stream.panelSection.title.advancedMatchRule': '高级匹配条件',
  'page.stream.PanelSection.title.defineRequestParams': '请求参数定义',
  'page.stream.PanelSection.title.responseResult': '请求响应结果',

  'page.stream.httpAction': '行为',
  'page.stream.httpOverrideOrCreate': '重写/创建',

  'page.stream.form.itemLabel.domainNameOrIp': '域名/IP',
  'page.stream.form.itemExtraMessage.domainNameOrIp': '使用域名时，默认解析本地：/etc/resolv.conf',
  'page.stream.portNumber': '端口',
  'page.stream.weight': '权重',

  'page.stream.radio.static': '静态改写',
  'page.stream.radio.regex': '正则改写',
  // Need a better translation
  'page.stream.form.itemLabel.regex': '匹配正则表达式',
  'page.stream.form.itemLabel.template': '转发路径模版',
  'page.stream.form.itemHelp.status': '路由创建后是否可以使用， 默认值为 false',
  'page.stream.radio.staySame': '保持原样',
  'page.stream.input.placeholder.newPath': '例如：/foo/bar/index.html',
  'page.stream.form.itemLabel.newPath': '新路径',
  'page.stream.form.itemLabel.newHost': '新域名',
  'page.stream.popconfirm.title.offline': '确定下线该路由吗？',
  'page.stream.debug.showResultAfterSendRequest': '发送请求后在此查看响应结果',
  'page.stream.TabPane.queryParams': '查询参数',
  'page.stream.TabPane.bodyParams': '请求体参数',
  'page.stream.TabPane.headerParams': '请求头参数',
  'page.stream.TabPane.authentication': '认证',
  'page.stream.TabPane.response': '响应结果',
  'page.stream.TabPane.header': '响应请求头参数',
  'page.stream.debugWithoutAuth': '当前请求不启用任何认证方式。',
  'page.stream.button.exportOpenApi': '导出 OpenAPI',
  'page.stream.exportRoutesTips': '请选择导出文件的类型',
  'page.stream.button.importOpenApi': '导入 OpenAPI',
  'page.stream.button.selectFile': '请选择上传文件',
  'page.stream.list': '数据流列表',
  'page.stream.tooltip.pluginOrchOnlySupportChrome': '插件编排仅支持 Chrome 浏览器。',
  'page.stream.tooltip.pluginOrchWithoutProxyRewrite':
    '当步骤一中 配置了 请求改写时，不可使用插件编排模式。',
  'page.stream.tooltip.pluginOrchWithoutRedirect':
    '当步骤一中 重定向 选择为 启用 HTTPS 时，不可使用插件编排模式。',

  'page.stream.tabs.normalMode': '普通模式',
  'page.stream.tabs.orchestration': '编排模式',

  'page.stream.list.description':
    '数据流(Stream)用于配置APISIX提前预留的4层端口向后端4层端口进行数据转发。',

  'page.stream.configuration.name.rules.required.description': '请输入路由名称',
  'page.stream.configuration.name.placeholder': '请输入路由名称',
  'page.stream.configuration.desc.tooltip': '路由的描述信息',
  'page.stream.configuration.publish.tooltip': '用于控制路由创建后，是否立即发布到网关',
  'page.stream.configuration.version.placeholder': '请输入路由版本号',
  'page.stream.configuration.version.tooltip': '路由的版本号，如 V1',
  'page.stream.configuration.normal-labels.tooltip': '为路由增加自定义标签，可用于路由分组。',

  'page.stream.configuration.path.rules.required.description': '请输入有效的 HTTP 请求路径',
  'page.stream.configuration.path.placeholder': '请输入 HTTP 请求路径',
  'page.stream.configuration.remote_addrs.placeholder': '请输入客户端地址',
  'page.stream.configuration.host.placeholder': '请输入 HTTP 请求域名',

  'page.stream.service.none': '不绑定服务',

  'page.stream.rule.create': '创建规则',
  'page.stream.rule.edit': '编辑规则',

  'page.stream.advanced-match.operator.sample.IN': '请输入数组，示例：["1", "2"]',
  'page.stream.advanced-match.operator.sample.~~': '请输入正则表达式，示例：[a-z]+',
  'page.stream.fields.service_id.invalid': '请检查路由绑定的服务',
  'page.stream.fields.service_id.without-upstream': '如果不绑定服务，则必须设置上游服务（步骤 2）',
  'page.stream.advanced-match.tooltip':
    '支持通过请求头，请求参数、Cookie 进行路由匹配，可应用于灰度发布，蓝绿测试等场景。',
  'page.stream.advanced-match.message': '提示',
  'page.stream.advanced-match.tips.requestParameter': '请求参数：请求 URL 中的 Query 部分',
  'page.stream.advanced-match.tips.postRequestParameter':
    'POST 请求参数：仅支持 POST x-www-form-urlencoded 表单',
  'page.stream.advanced-match.tips.builtinParameter': '内置参数：Nginx 内部参数',

  'page.stream.fields.custom.redirectOption.tooltip': '在此配置 redirect 插件',
  'page.stream.fields.service_id.tooltip': '绑定服务（Service）对象，以便复用其中的配置。',

  'page.stream.fields.vars.invalid': '请检查高级匹配条件配置',
  'page.stream.fields.vars.in.invalid': '使用 IN 操作符时，请输入数组格式的参数值。',
  'page.stream.fields.server_addr.tooltip': '通常为APISIX的IP地址',
  'page.stream.fields.server_port.tooltip': '指定APISIX提前分配的4层端口',

  'page.stream.data_loader.import': '导入',
  'page.stream.data_loader.import_panel': '导入路由',
  'page.stream.data_loader.types.openapi3': 'OpenAPI 3',
  'page.stream.data_loader.types.openapi_legacy': 'OpenAPI 3 旧版',
  'page.stream.data_loader.labels.loader_type': '数据加载器类型',
  'page.stream.data_loader.labels.task_name': '导入任务名称',
  'page.stream.data_loader.labels.upload': '上传',
  'page.stream.data_loader.labels.openapi3_merge_method': '合并 HTTP 方法',
  'page.stream.data_loader.tips.select_type': '请选择数据加载器',
  'page.stream.data_loader.tips.input_task_name': '请输入导入任务名称',
  'page.stream.data_loader.tips.click_upload': '点击上传',
  'page.stream.data_loader.tips.openapi3_merge_method':
    '是否将 OpenAPI 路径中的多个 HTTP 方法合并为单一路由。当你的路径中多个 HTTP 方法有不同的细节配置（如 securitySchema），你可以关闭这个选项，将为不同的 HTTP 方法生成单独的路由。',
};
