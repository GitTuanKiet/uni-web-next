import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";
import { Info_App } from "@/lib/constants";

export interface PaymentCompletedTemplateProps {
  name: string;
  amount: string;
}

export const PaymentCompletedTemplate = ({ name, amount }: PaymentCompletedTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Payment completed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>{Info_App.title}</Text>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Your payment of {amount} has been completed successfully.
            </Text>
            <Text style={text}>Have a nice day!</Text>
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