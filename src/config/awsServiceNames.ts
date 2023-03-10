export const topLevelAwsServices = {
    awsAccount: "aws_account",
    awsRegion: "aws_region",
    awsAthenaDataCatalog: "aws_athena_data_catalog",
    awsApiGatewayRestApi: "aws_api_gateway_rest_api",
    awsCloud9EnvironmentEc2: "aws_cloud9_environment_ec2",
    awsCloudformationStack: "aws_cloudformation_stack",
    awsCloudfrontDistribution: "aws_cloudfront_distribution",
    awsCloudwatchMetricAlarm: "aws_cloudwatch_metric_alarm",
    awsCodeBuild: "aws_code_build",
    awsCognitoIdentityPool: "aws_cognito_identity_pool",
    awsCognitoUserPool: "aws_cognito_user_pool",
    awsDbInstance: "aws_db_instance",
    awsDynamodb: "aws_dynamodb",
    awsDynamodbTable: "aws_dynamodb_table",
    awsEcsCluster: "aws_ecs_cluster",
    awsEfsFileSystem: "aws_efs_file_system",
    awsEksCluster: "aws_eks_cluster",
    awsEcrRepository: "aws_ecr_repository",
    awsElasticBeanstalkApplication: "aws_elastic_beanstalk_application",
    awsElasticacheCluster: "aws_elasticache_cluster",
    awsElasticacheReplicationGroup: "aws_elasticache_replication_group",
    awsEmrCluster: "aws_emr_cluster",
    awsGlueRegistry: "aws_glue_registry",
    awsIotThing: "aws_iot_thing",
    awsKinesisFirehoseDeliveryStream: "aws_kinesis_firehose_delivery_stream",
    awsKinesisStream: "aws_kinesis_stream",
    awsKmsKey: "aws_kms_key",
    awsLambdaFunction: "aws_lambda_function",
    awsMwaaEnvironment: "aws_mwaa_environment",
    awsRdsCluster: "aws_rds_cluster",
    awsRoute53Zone: "aws_route53_zone",
    awsS3Bucket: "aws_s3_bucket",
    awsSesEmailIdentity: "aws_ses_email_identity",
    awsSesDomainIdentity: "aws_ses_domain_identity",
    awsSnsTopic: "aws_sns_topic",
    awsSqsQueue: "aws_sqs_queue",
    awsVpc: "aws_vpc",
    awsVpnConnection: "aws_vpn_connection",
    awsRedshiftCluster: "aws_redshift_cluster",
    awsSageMakerProject: "aws_sage_maker_project",
};

const otherAwsServices = {
    awsApiGatewayResource: "aws_api_gateway_resource",
    awsApiGatewayStage: "aws_api_gateway_stage",
    awsAutoscalingGroup: "aws_autoscaling_group",
    awsAvailabilityZone: "aws_availability_zone",
    awsEbsVolume: "aws_ebs_volume",
    awsEc2TransitGateway: "aws_ec2_transit_gateway",
    awsEc2TransitGatewayVpcAttachment: "aws_ec2_transit_gateway_vpc_attachment",
    awsCustomerGateway: "aws_customer_gateway",
    awsEcsService: "aws_ecs_service",
    awsEcsTask: "aws_ecs_task",
    awsEcsTaskDefinition: "aws_ecs_task_definition",
    awsEcsContainerDefinition: "aws_ecs_container_definition",
    awsElasticBeanstalkEnvironment: "aws_elastic_beanstalk_environment",
    awsEfsMountTarget: "aws_efs_mount_target",
    awsElb: "aws_elb",
    awsGlueJob: "aws_glue_job",
    awsInstance: "aws_instance",
    awsInternetGateway: "aws_internet_gateway",
    kubernetesNode: "kubernetes_node",
    kubernetesPod: "kubernetes_pod",
    awsLb: "aws_lb",
    awsLbListener: "aws_lb_listener",
    awsNatGateway: "aws_nat_gateway",
    awsNetworkAcl: "aws_network_acl",
    awsRoute53Record: "aws_route53_record",
    awsRouteTable: "aws_route_table",
    awsSageMakerExperiment: "aws_sage_maker_experiment",
    awsSecurityGroup: "aws_security_group",
    awsSubnet: "aws_subnet",
    awsAppsyncGraphqlApi: "aws_appsync_graphql_api",
    awsAppsyncApiKey: "aws_appsync_api_key",
    awsAppsyncType: "aws_appsync_type",
    awsAppsyncDatasource: "aws_appsync_datasource",
    awsAppsyncFunction: "aws_appsync_function",
    awsAppsyncResolver: "aws_appsync_resolver",
    awsClientVpnEndpoint: "aws_ec2_client_vpn_endpoint",
    awsCloudformationStackSet: "aws_cloudformation_stack_set",
    awsCloudtrail: "cloudtrail",
    awsEip: "aws_eip",
    awsNetworkInterface: "aws_network_interface",
    awsSecretsManagerSecret: "aws_secretsmanager_secret",
    awsVpnGateway: "aws_vpn_gateway",
    awsWafV2WebAcl: "aws_waf_v2_web_acl",
    awsIamPasswordPolicy: "aws_iam_password_policy",
    awsIamSamlProvider: "aws_iam_saml_provider",
    awsIamOpenIdConnectProvider: "aws_iam_open_id_connect_provider",
    awsIamServerCertificate: "aws_iam_server_certificate",
};

const iamCategories = {
    awsIamGroupPolicyAttachment: "aws_iam_group_policy_attachment",
    awsIamGroups: "aws_iam_groups",
    awsIamGroup: "aws_iam_group",
    awsIamPolicy: "aws_iam_policy",
    awsIamPolicies: "aws_iam_polocies" /* Ty misspelled this in the VSDAPI so don't fix it */,
    awsIamPolicyAttachment: "aws_iam_policy_attachment",
    awsIamRolePolicy: "aws_iam_role_policy",
    awsIamRole: "aws_iam_role",
    awsIamRoles: "aws_iam_roles",
    awsIamUser: "aws_iam_user",
    awsIamUsers: "aws_iam_users",
};

export const humanReadableAwsNames = {
    s3: "S3",
    sg: "Security Group",
    ebs: "EBS",
    sqs: "SQS",
    rds: "RDS",
    alb: "ALB",
    iam: "IAM",
    elb: "ELB (Classic)",
    nacl: "Network ACLs",
    subnet: "Subnet",
    ec2_instance: "EC2",
};

export const includeCuidResourceTypes = [otherAwsServices.awsAutoscalingGroup];

const allServices = {
    ...iamCategories,
    ...otherAwsServices,
    ...topLevelAwsServices,
};
export default allServices;
