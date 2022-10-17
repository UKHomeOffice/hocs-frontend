{{- define "healthcheck.envs" }}
startupProbe:
  httpGet:
    path: /health
    port: http
    httpHeaders:
      - name: X-probe
        value: kubelet
  initialDelaySeconds: 6
  periodSeconds: 2
  failureThreshold: 22
livenessProbe:
  httpGet:
    path: /health
    port: http
    httpHeaders:
      - name: X-probe
        value: kubelet
  periodSeconds: 2
readinessProbe:
  httpGet:
    path: /health
    port: http
    httpHeaders:
      - name: X-probe
        value: kubelet
  periodSeconds: 2
{{- end -}}
