export interface TelegramProxyConfigType {
    port: number;
    host: string;
    dc_ip: string[];
    verbose: boolean;
    check_updates: boolean;
    log_max_mb: number;
    buf_kb: number;
    pool_size: number;
    cfproxy: boolean;
    cfproxy_user_domain_enabled: boolean;
    cfproxy_user_domain: never[];
    cfproxy_worker_enabled: boolean;
    cfproxy_worker_domain: never[];
    force_test_dc: boolean;
    secret: string;
    language: string;
    autostart: boolean;
}