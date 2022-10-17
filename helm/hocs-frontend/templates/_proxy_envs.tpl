{{- define "proxy.envs" }}
- name: HTTP2
  value: 'TRUE'
- name: PROXY_SERVICE_HOST_1
  value: '127.0.0.1'
- name: PROXY_SERVICE_PORT_1
  value: '8081'
- name: PROXY_SERVICE_HOST_2
  value: '127.0.0.1'
- name: PROXY_SERVICE_PORT_2
  value: '8082'
- name: LOCATIONS_CSV
  value: '/, /api/'
- name: NAXSI_USE_DEFAULT_RULES
  value: 'FALSE'
- name: ENABLE_UUID_PARAM
  value: 'FALSE'
- name: HTTPS_REDIRECT
  value: 'FALSE'
- name: SERVER_CERT
  value: /certs/tls.pem
- name: SERVER_KEY
  value: /certs/tls-key.pem
- name: ERROR_REDIRECT_CODES
  value: '501 502 503 504'
- name: ADD_NGINX_HTTP_CFG
  value: 'fastcgi_buffers 16 64k; fastcgi_buffer_size 128k; proxy_buffer_size 128k; proxy_buffers 4 64k; proxy_busy_buffers_size 128k; client_header_buffer_size 8k; large_client_header_buffers 4 128k;'
- name: CLIENT_MAX_BODY_SIZE
  value: '52'
{{- end -}}
