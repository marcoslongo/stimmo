import type React from "react"
import { Card } from "@/components/ui/card"
import { Mail, Shield, Lock, Eye, Clock, AlertCircle } from "lucide-react"
import { Footer } from "@/components/footer"
import { HeaderInternal } from "@/components/header-internal"

export const metadata = {
  title: "Política de Privacidade | Simosul",
  description: "Conheça nossa política de privacidade e como protegemos seus dados pessoais de acordo com a LGPD.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderInternal />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-40">
        <section className="mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 border border-border">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3">Política de Privacidade</h2>
                <p className="text-foreground/80 leading-relaxed">
                  A Indústria de Móveis Simosul Ltda. valoriza a privacidade de seus usuários e tem o compromisso de
                  atuar de forma ética e transparente, protegendo seus dados pessoais em conformidade com a Lei Geral de
                  Proteção de Dados (LGPD).
                </p>
              </div>
            </div>
          </div>
        </section>
        <Card className="mb-12 p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Índice</h3>
          <ul className="space-y-2">
            {[
              { id: "introducao", label: "Introdução" },
              { id: "bases-legais", label: "Bases Legais e Princípios" },
              { id: "capacidade", label: "Capacidade Legal" },
              { id: "sites", label: "Sobre Nossos Sites" },
              { id: "coleta", label: "Coleta de Dados" },
              { id: "direitos", label: "Seus Direitos" },
              { id: "seguranca", label: "Segurança de Dados" },
              { id: "cookies", label: "Política de Cookies" },
              { id: "contato", label: "Contato" },
            ].map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-primary hover:underline text-sm">
                  → {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-8">
          <Section id="introducao" icon={<Eye className="w-6 h-6" />} title="Introdução">
            <p>
              Por favor, leia atentamente nossa Política de Privacidade. A presente Política tem o objetivo de
              demonstrar o compromisso da Indústria de Móveis Simosul Ltda. de proteger a privacidade e os dados
              pessoais de seus usuários, nos termos da Lei nº 13.709/18 (Lei Geral de Proteção de Dados ou LGPD) e
              demais leis sobre o tema.
            </p>
            <p className="mt-4">
              Esta Política se aplica a todos os usuários e resume como a Indústria de Móveis Simosul Ltda. poderá
              coletar, produzir, receptar, classificar, utilizar, acessar, reproduzir, transmitir, distribuir,
              processar, arquivar, armazenar, eliminar, avaliar, controlar, modificar, comunicar, transferir, difundir
              ou extrair os dados pessoais coletados, de acordo com as bases legais aplicáveis.
            </p>
          </Section>

          <Section id="bases-legais" icon={<Shield className="w-6 h-6" />} title="Bases Legais e Princípios">
            <p>
              O tratamento de dados pessoais observará, conforme o caso, as bases legais previstas na LGPD, incluindo:
            </p>
            <ul className="mt-4 space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Execução de contrato ou de procedimentos preliminares</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Cumprimento de obrigação legal ou regulatória</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Exercício regular de direitos</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Legítimo interesse com avaliação de balanceamento</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Consentimento para finalidades opcionais</span>
              </li>
            </ul>
            <p className="mt-4">
              <strong>Princípios respeitados:</strong> finalidade, adequação, necessidade, livre acesso, qualidade dos
              dados, transparência, segurança, prevenção, não discriminação e responsabilização.
            </p>
          </Section>

          <Section id="capacidade" icon={<AlertCircle className="w-6 h-6" />} title="Capacidade Legal">
            <p>Ao acessar e/ou utilizar os sites geridos pela Indústria de Móveis Simosul Ltda., o usuário declara:</p>
            <ul className="mt-4 space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-primary font-bold">(I)</span>
                <span>
                  Ter no mínimo 18 (dezoito) anos ou ser emancipado, sendo totalmente capaz de praticar os atos da vida
                  civil; ou
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">(II)</span>
                <span>
                  Se menor que 18 (dezoito) anos, estar devidamente representado ou assistido, nos termos da lei.
                </span>
              </li>
            </ul>
          </Section>

          <Section id="sites" icon={<Globe className="w-6 h-6" />} title="Sobre Nossos Sites">
            <p className="mb-4">
              Esta Política de Privacidade refere-se aos seguintes sites e plataformas geridos pela Indústria de Móveis
              Simosul Ltda:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Simonetto", url: "www.simonetto.com.br" },
                { name: "Stimmo", url: "www.stimmo.com.br" },
                { name: "Instagram - Simonetto", url: "instagram.com/simonetto.oficial" },
                { name: "Instagram - Stimmo", url: "instagram.com/stimmo.oficial" },
                { name: "Facebook - Simonetto", url: "facebook.com/simonetto.oficial" },
                { name: "TikTok - Stimmo", url: "tiktok.com/@stimmo.oficial" },
                { name: "YouTube - Stimmo", url: "youtube.com/@stimmo.oficial" },
                { name: "YouTube - Simonetto", url: "youtube.com/@simonetto.oficial" },
              ].map((site, idx) => (
                <div key={idx} className="text-sm p-2 bg-muted/50 rounded border border-border/50">
                  <p className="font-medium text-foreground">{site.name}</p>
                  <p className="text-muted-foreground text-xs">{site.url}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="coleta" icon={<Lock className="w-6 h-6" />} title="Coleta de Dados">
            <p>
              Você está ciente de que todos os seus dados pessoais são fornecidos de forma consciente e voluntária por
              meio de nossos sites e páginas sociais. Ao preencher os formulários, seus dados serão encaminhados para a
              loja mais próxima para fins de contatos comerciais.
            </p>
            <Card className="mt-4 p-4 bg-muted/50 border-border">
              <h4 className="font-semibold text-foreground mb-2">Encaminhamento a Lojas e Parceiros</h4>
              <p className="text-sm text-foreground/80">
                Quando houver encaminhamento do seu contato para a "loja mais próxima" ou a parceiros, estes poderão
                atuar como Operadores, seguindo instruções da Simosul com obrigações de confidencialidade e segurança. O
                compartilhamento será transparente e cada parceiro responderá por sua própria política de privacidade.
              </p>
            </Card>
          </Section>

          <Section id="direitos" icon={<Eye className="w-6 h-6" />} title="Seus Direitos">
            <p>
              De acordo com a LGPD, você poderá exercer os seguintes direitos através dos canais indicados nesta
              Política:
            </p>
            <ul className="mt-4 space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Confirmação</strong> da existência de tratamento
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Acesso</strong> aos seus dados
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Correção</strong> de dados imprecisos
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Anonimização, bloqueio ou eliminação</strong> de dados
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Portabilidade</strong> de dados
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Informação</strong> sobre compartilhamentos
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Revisão</strong> de decisões automatizadas
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Revogação</strong> de consentimento
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Forneceremos resposta simplificada imediata e resposta conclusiva em até 15 (quinze) dias, observados
              prazos legais e a segurança das informações.
            </p>
          </Section>

          <Section id="seguranca" icon={<Lock className="w-6 h-6" />} title="Segurança e Incidentes">
            <p>Adotamos controles técnicos e organizacionais proporcionais ao risco, incluindo:</p>
            <ul className="mt-4 space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Controle de acesso por perfil</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Criptografia em trânsito e em repouso</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Registros de logs e backups</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Gestão de vulnerabilidades e testes periódicos</span>
              </li>
            </ul>
            <p className="mt-4">
              Em caso de incidente de segurança, seguiremos procedimento de resposta e avaliaremos a necessidade de
              notificação à ANPD e aos titulares, conforme a LGPD.
            </p>
          </Section>

          <Section id="cookies" icon={<Clock className="w-6 h-6" />} title="Política de Cookies">
            <p>
              A Indústria de Móveis Simosul Ltda. utiliza Cookies e identificadores anônimos para controle de audiência,
              navegação, segurança e publicidade. Você concorda com essa utilização ao aceitar esta Política de
              Privacidade.
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded border border-border">
              <h4 className="font-semibold text-foreground mb-2">O que são Cookies?</h4>
              <p className="text-sm text-foreground/80">
                Cookies são arquivos criados pelos websites que, enquanto você navega na internet, são armazenados em
                seu navegador e ajudam a personalizar seu acesso.
              </p>
            </div>
            <p className="mt-4">
              <strong>Finalidades:</strong> Garantir segurança, aperfeiçoar usabilidade e experiência, comunicação
              eficiente, responder dúvidas e realizar pesquisas de marketing.
            </p>
            <p className="mt-4">
              Você pode desativar os Cookies através das preferências do seu navegador. Saiba que neste caso, sua
              navegação poderá se tornar limitada e algumas funcionalidades dos sites podem ficar comprometidas.
            </p>
            <Card className="mt-4 p-4 bg-muted/50 border-border">
              <h4 className="font-semibold text-foreground mb-2">Google Analytics</h4>
              <p className="text-sm text-foreground/80">
                Utilizamos o Google Analytics para coleta e processamento de dados. Para informações sobre as políticas
                do Google, visite suas páginas de privacidade e termos de serviço. Para Google Analytics (GA4), adotamos
                anonimização de IP quando tecnicamente viável.
              </p>
            </Card>
          </Section>
          <Section id="contato" icon={<Mail className="w-6 h-6" />} title="Contato e DPO">
            <p className="mb-4">
              Caso tenha questões sobre esta Política ou sobre o tratamento de seus dados pessoais, você pode entrar em
              contato através dos seguintes canais:
            </p>
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Encarregado de Proteção de Dados (DPO)</p>
                  <p className="font-semibold text-foreground">Mauricio Nardi Ruschel</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="text-foreground">TI</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>
                    <a href="mailto:mauricio@simonetto.com.br" className="text-primary hover:underline">
                      mauricio@simonetto.com.br
                    </a>
                  </p>
                </div>
              </div>
            </Card>
            <p className="mt-4 text-sm text-muted-foreground">
              Você também pode contatar a Autoridade Nacional de Proteção de Dados (ANPD) através de seus canais
              oficiais para reclamações relacionadas à proteção de dados.
            </p>
          </Section>
          <Section title="Informações Adicionais">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded border border-border">
                <p className="font-semibold text-foreground mb-2">Vigência</p>
                <p className="text-sm text-foreground/80">
                  Esta Política é válida a partir de 17/08/2020 e vigerá por período indeterminado.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded border border-border">
                <p className="font-semibold text-foreground mb-2">Atualizações</p>
                <p className="text-sm text-foreground/80">
                  Caso esta Política seja alterada, a informação será comunicada de forma visível em nossos sites e
                  redes sociais. A versão revisada substituirá este documento a partir da data da sua publicação.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded border border-border">
                <p className="font-semibold text-foreground mb-2">Jurisdição</p>
                <p className="text-sm text-foreground/80">
                  Esta Política é regida pela LGPD e demais leis vigentes na República Federativa do Brasil. Fica eleito
                  o Foro da Comarca de Realeza, Paraná, como competente para dirimir qualquer controvérsia.
                </p>
              </div>
            </div>
          </Section>
        </div>
        <div className="mt-12 p-8 bg-primary/10 rounded-lg border border-primary/20 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Tem dúvidas sobre sua privacidade?</h3>
          <p className="text-foreground/80 mb-4">
            Entre em contato conosco através do email do DPO ou acesse nossos sites para mais informações.
          </p>
          <a
            href="mailto:mauricio@simonetto.com.br"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
          >
            <Mail className="w-4 h-4" />
            Enviar Email
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface SectionProps {
  id?: string
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
}

function Section({ id, icon, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-primary">{icon}</div>}
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
      </div>
      <div className="text-foreground/80 space-y-3 leading-relaxed">{children}</div>
    </section>
  )
}

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
