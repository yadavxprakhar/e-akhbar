import React from 'react';

// Simplified layout matching user screenshot
const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '60px 24px', animation: 'floatUp 0.5s ease-out', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
    </div>
);

const PageTitle: React.FC<{ title: string }> = ({ title }) => (
    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>{title}</h1>
);

const PageSubtitle: React.FC<{ subtitle: string }> = ({ subtitle }) => (
    <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '48px' }}>{subtitle}</p>
);

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '40px', marginBottom: '16px' }}>{title}</h2>
);

const SectionText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '24px' }}>{children}</p>
);

export const AboutPage: React.FC = () => {
    return (
        <PageContainer>
            <PageTitle title="About e-akhbar" />
            <PageSubtitle subtitle="Building the next generation of intelligent news." />
            
            <SectionHeading title="1) Our Mission" />
            <SectionText>
                At e-akhbar, we believe that staying informed shouldn't mean drowning in noise. Our mission is to curate the world's knowledge and deliver it directly to you based on your unique interests and passions. We use cutting-edge AI and advanced curation algorithms to filter out the clutter, ensuring that every article you read is relevant, trustworthy, and impactful.
            </SectionText>

            <SectionHeading title="2) Our Story" />
            <SectionText>
                Founded in 2026, e-akhbar started as a simple idea: what if your news feed actually understood you? Frustrated by the echo chambers and sensationalism of traditional social media and news aggregators, our team of data scientists and journalists set out to build a platform that respects your time and intelligence. Today, e-akhbar serves thousands of readers who demand high-quality, focused intelligence daily.
            </SectionText>
            
            <SectionHeading title="3) Trust & Personalization" />
            <SectionText>
                We vet our sources rigorously to ensure you only get factual, unbiased reporting. Your feed is yours alone. We adapt to your reading habits securely and privately.
            </SectionText>
        </PageContainer>
    );
};

export const CareersPage: React.FC = () => {
    return (
        <PageContainer>
            <PageTitle title="Join the Team" />
            <PageSubtitle subtitle="Help us build the future of personalized intelligence." />
            
            <SectionHeading title="1) Exciting Roles Coming Soon" />
            <SectionText>
                We are currently gearing up for our next phase of growth. Check back soon for open positions across Engineering, Design, and Editorial!
            </SectionText>
        </PageContainer>
    );
};

export const PrivacyPage: React.FC = () => {
    return (
        <PageContainer>
            <PageTitle title="Privacy Policy" />
            <PageSubtitle subtitle="Effective May 2026" />
            
            <SectionHeading title="1) Data Collection" />
            <SectionText>
                We collect minimal data required to provide you with a personalized news experience. This includes your saved articles (bookmarks), category preferences, and reading habits to improve our recommendation algorithms.
            </SectionText>
            
            <SectionHeading title="2) How We Use Your Data" />
            <SectionText>
                Your data is strictly used to customize the content you see on e-akhbar. We do not sell your personal information to third-party advertisers or data brokers under any circumstances.
            </SectionText>
            
            <SectionHeading title="3) Security" />
            <SectionText>
                We implement industry-standard encryption and secure database practices (Firebase Security Rules) to ensure that your data is protected from unauthorized access.
            </SectionText>
            
            <SectionHeading title="4) Your Rights" />
            <SectionText>
                You have the right to request a copy of your data or to have your account and all associated data permanently deleted at any time through your account settings.
            </SectionText>
        </PageContainer>
    );
};

export const TermsPage: React.FC = () => {
    return (
        <PageContainer>
            <PageTitle title="Terms of Service" />
            <PageSubtitle subtitle="Effective May 2026" />
            
            <SectionHeading title="1) Acceptance of Terms" />
            <SectionText>
                By accessing or using e-akhbar, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </SectionText>
            
            <SectionHeading title="2) User Accounts" />
            <SectionText>
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </SectionText>
            
            <SectionHeading title="3) Content and Intellectual Property" />
            <SectionText>
                The news articles and images aggregated on e-akhbar remain the intellectual property of their respective publishers and authors. e-akhbar is an aggregator and does not claim ownership of third-party content.
            </SectionText>
            
            <SectionHeading title="4) Termination" />
            <SectionText>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </SectionText>
        </PageContainer>
    );
};
