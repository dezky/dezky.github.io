import awsServiceNames from "./awsServiceNames";

const {
    awsAccount,
    awsApiGatewayRestApi,
    awsAppsyncGraphqlApi,
    awsAutoscalingGroup,
    awsAvailabilityZone,
    awsCloud9EnvironmentEc2,
    awsCloudformationStack,
    awsCloudformationStackSet,
    awsCloudfrontDistribution,
    awsCloudwatchMetricAlarm,
    awsCognitoIdentityPool,
    awsCognitoUserPool,
    awsDbInstance,
    awsEbsVolume,
    awsEc2TransitGateway,
    awsCustomerGateway,
    awsEcsCluster,
    awsEcsTask,
    awsEfsFileSystem,
    awsEfsMountTarget,
    awsEksCluster,
    awsEcrRepository,
    awsElasticBeanstalkApplication,
    awsElasticBeanstalkEnvironment,
    awsElasticacheCluster,
    awsElasticacheReplicationGroup,
    awsEmrCluster,
    awsEip,
    awsInstance,
    awsInternetGateway,
    awsIotThing,
    awsKmsKey,
    awsLambdaFunction,
    awsNatGateway,
    awsNetworkAcl,
    awsNetworkInterface,
    awsRdsCluster,
    awsRegion,
    awsRoute53Record,
    awsRoute53Zone,
    awsRouteTable,
    awsS3Bucket,
    awsSecurityGroup,
    awsSesDomainIdentity,
    awsSesEmailIdentity,
    awsSnsTopic,
    awsSqsQueue,
    awsSubnet,
    awsVpc,
    awsEc2TransitGatewayVpcAttachment,
    awsVpnConnection,
    awsRedshiftCluster,
    awsAthenaDataCatalog,
    awsCodeBuild,
    awsGlueJob,
    awsGlueRegistry,
    awsMwaaEnvironment,
    awsSageMakerExperiment,
    awsSageMakerProject,
} = awsServiceNames;

const displayNames = {
    [awsAccount]: "AWS Account",
    [awsApiGatewayRestApi]: "API Gateway",
    [awsAppsyncGraphqlApi]: "AppSync GraphQL API",
    [awsAutoscalingGroup]: "Autoscaling Group",
    [awsAvailabilityZone]: "Availability Zone",
    [awsCloud9EnvironmentEc2]: "Cloud 9 Environment",
    [awsCloudformationStack]: "Cloudformation Stack",
    [awsCloudformationStackSet]: "Cloudformation Stack Set",
    [awsCloudfrontDistribution]: "Cloudfront Distribution",
    [awsCloudwatchMetricAlarm]: "Cloudwatch Metric Alarm",
    [awsCognitoIdentityPool]: "Cognito Identity Pool",
    [awsCognitoUserPool]: "Cognito User Pool",
    [awsDbInstance]: "Database Instance",
    [awsRedshiftCluster]: "Redshift Cluster",
    [awsEc2TransitGateway]: "Transit Gateway",
    [awsEc2TransitGatewayVpcAttachment]: "Transit Gateway VPC Attachment",
    [awsCustomerGateway]: "Customer Gateway",
    [awsEbsVolume]: "EBS Volume",
    [awsEcsCluster]: "ECS Cluster",
    [awsEcsTask]: "ECS Task",
    [awsEfsFileSystem]: "EFS File System",
    [awsEfsMountTarget]: "EFS Mount Target",
    [awsEksCluster]: "EKS Cluster",
    [awsEcrRepository]: "ECR Repository",
    [awsElasticBeanstalkApplication]: "Elastic Beanstalk Application",
    [awsElasticBeanstalkEnvironment]: "Elastic Beanstalk Environment",
    [awsElasticacheCluster]: "Elasticache Cluster",
    [awsElasticacheReplicationGroup]: "Elasticache Replication Group",
    [awsEmrCluster]: "EMR Cluster",
    [awsEip]: "Elastic IP",
    [awsInstance]: "EC2 Instance",
    [awsInternetGateway]: "Internet Gateway",
    [awsIotThing]: "IOT Thing",
    [awsKmsKey]: "KMS Key",
    [awsLambdaFunction]: "Lambda Function",
    [awsNatGateway]: "NAT Gateway",
    [awsNetworkAcl]: "NACL",
    [awsNetworkInterface]: "Network Interface",
    [awsRdsCluster]: "RDS Cluster",
    [awsRegion]: "Region",
    [awsRoute53Record]: "Route 53 Record",
    [awsRoute53Zone]: "Route 53 Zone",
    [awsRouteTable]: "Route Table",
    [awsS3Bucket]: "S3 Bucket",
    [awsSecurityGroup]: "Security Group",
    [awsSesDomainIdentity]: "SES Domain Identity",
    [awsSesEmailIdentity]: "SES Email Identity",
    [awsSnsTopic]: "SNS Topic",
    [awsSqsQueue]: "SQS Queue",
    [awsSubnet]: "Subnet",
    [awsVpc]: "VPC",
    [awsVpnConnection]: "VPN Connection",
    [awsAthenaDataCatalog]: "Athena Data Catalog",
    [awsCodeBuild]: "CodeBuild",
    [awsGlueJob]: "Glue Job",
    [awsGlueRegistry]: "Glue Registry",
    [awsMwaaEnvironment]: "Managed Workflows for Apache Airflow Environment",
    [awsSageMakerExperiment]: "SageMaker Experiment",
    [awsSageMakerProject]: "SageMaker Project",
};
export default displayNames;
