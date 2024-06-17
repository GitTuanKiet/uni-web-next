import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";
import { Info_App } from "@/lib/constants";

export interface BillingCancelledTemplateProps {
  name: string;
}

export const BillingCancelledTemplate = ({ name }: BillingCancelledTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Billing cancelled</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>{Info_App.title}</Text>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Your subscription has been cancelled.
            </Text>
            <Text style={text}>We are sorry to see you go!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const title = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const text = {
  fontSize: "16px",
  marginBottom: "10px",
};