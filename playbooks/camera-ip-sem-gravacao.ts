import { Playbook } from "@/lib/playbook"

export const camIpNoRecording: Playbook = {
    id: "PL-01",
    name: "Câmera IP sem gravação",
    steps: [
        {
            id: "CAM-00",
            title: "Escopo do problema",
            appliesTo: ["CAMERA_SD", "NVR_DVR", "VMS"],
            whyItMatters: "Define onde investigar. Uma câmera afetada aponta para a câmera ou sua configuração; várias afetadas apontam para gravador, servidor, armazenamento ou rede.",
            evidenceRequired: "Quantas câmeras estão afetadas, desde quando (data/hora aproximada) e se houve mudança recente (rede, energia, firmware, configuração). Só 'câmera sem gravar' não conta.",
            vagueExamples: ["câmera sem gravar", "cliente disse que não grava", "problema recente"],
            nextAction: "Perguntar ao cliente quais câmeras, desde quando e o que mudou antes do problema."
        },
        {
            id: "CAM-01",
            title: "Conectividade (ping)",
            appliesTo: ["NVR_DVR", "VMS"],
            whyItMatters: "Se a câmera não responde, o problema está antes da configuração de gravação (rede, cabo, PoE ou IP). Perda parcial ou latência instável aponta para cabo, porta do switch ou alimentação.",
            evidenceRequired: "Saída do ping (ou resumo dela) com pacotes enviados/recebidos e latência mínima, média e máxima, e a origem do teste. Sem número de pacotes ou sem origem, não conta. Se câmera e gravador/servidor estiverem em redes diferentes, o ping também deve ser feito a partir da outra rede, informando a origem de cada teste.",
            vagueExamples: ["pingou ok", "tem conexão", "testei a rede"],
            nextAction: "Windows: ping -n 20 <ip-da-câmera> | Linux: ping -c 20 <ip-da-câmera>. Se câmera e gravador/servidor estiverem em redes diferentes, repetir o teste a partir da outra rede."
        },
        {
            id: "CAM-02",
            title: "Credenciais de acesso à câmera",
            appliesTo: ["NVR_DVR", "VMS"],
            whyItMatters: "Se a senha foi alterada na câmera e não no gravador/VMS, o canal fica sem vídeo ou offline e não grava, mesmo com a rede correta. Saber se a senha mudou recentemente ajuda o N2 a achar a causa.",
            evidenceRequired: "Status do canal/câmera no gravador ou VMS (como é exibido), resultado do login na interface da câmera com a credencial cadastrada no gravador (aceita ou recusada), e se a senha foi alterada recentemente. Nunca informar a senha no chamado.",
            vagueExamples: ["senha ok", "usuário correto", "conferi o acesso"],
            nextAction: "Verificar o status do canal no gravador/VMS e testar o login na interface da câmera com a credencial cadastrada. Anotar apenas o resultado. NÃO redefinir a senha nem restaurar a câmera de fábrica sem alinhar com o N2."
        },
        {
            id: "CAM-03",
            title: "Portas de comunicação",
            appliesTo: ["NVR_DVR", "VMS"],
            whyItMatters: "O ping só prova que a câmera responde na rede, não que a porta de vídeo está acessível. Porta alterada, bloqueada por firewall ou diferente entre câmera e gravador impede a transmissão do vídeo para gravação.",
            evidenceRequired: "Porta(s) testada(s), origem do teste (a partir da rede do gravador ou, no VMS, do servidor), resultado (aberta, conexão recusada ou timeout) e se as portas configuradas na câmera e no gravador/VMS coincidem.",
            vagueExamples: ["portas ok", "porta liberada", "testei a comunicação"],
            nextAction: "A partir da rede do gravador (ou do servidor do VMS): Windows: Test-NetConnection <ip-da-câmera> -Port <porta> | Linux: nc -zv <ip-da-câmera> <porta>. O padrão do RTSP é 554, mas a porta configurada pode ser outra. Anotar o resultado e comparar com a configuração dos dois lados."
        },
        {
            id: "CAM-04",
            title: "Verificar estado do cartão SD",
            appliesTo: ["CAMERA_SD"],
            whyItMatters: "Se a câmera não está reconhecendo o cartão SD pode significar que não suporta esse modelo de cartão, que o cartão está corrompido ou então não foi formatado da maneira correta.",
            evidenceRequired: "Se há cartão instalado na câmera, modelo e capacidade de armazenamento do cartão SD utilizado, status exatamente como a câmera exibe.",
            vagueExamples: ["cartão ok", "tem cartão SD"],
            nextAction: "Verificar na ficha técnica da câmera qual a capacidade máxima de armazenamento e acessar a interface da câmera e verificar as configurações de armazenamento. NÃO formatar o cartão antes de confirmar com o cliente que não há gravações a preservar."
        },
        {
            id: "CAM-05",
            title: "Configuração de gravação",
            appliesTo: ["CAMERA_SD", "NVR_DVR", "VMS"],
            whyItMatters: "Com hardware e rede ok, a câmera ainda não grava se a gravação estiver desabilitada, fora da agenda ou por evento sem o gatilho acontecer.",
            evidenceRequired: "Se a gravação está habilitada para essa câmera/canal, o modo (contínua, por evento/movimento ou agendada), a agenda, e onde foi conferido (câmera, gravador ou VMS).",
            vagueExamples: ["gravação configurada", "conferi as configurações", "tá habilitado"],
            nextAction: "Abrir a configuração de gravação no local certo (interface da câmera, do NVR/DVR ou do VMS) e anotar habilitação, modo e agenda do canal."
        },
        {
            id: "CAM-06",
            title: "Armazenamento do gravador ou servidor",
            appliesTo: ["NVR_DVR", "VMS"],
            whyItMatters: "Sem disco ou volume reconhecido, com espaço livre e atribuído ao canal, o gravador ou servidor não grava mesmo com a câmera correta. No VMS, volume cheio ou caminho de armazenamento indisponível também pode interromper a gravação.",
            evidenceRequired: "NVR/DVR: se há disco instalado e reconhecido, status como exibido, capacidade total e livre, e se há armazenamento atribuído ao canal da câmera. VMS: volume ou caminho de armazenamento configurado para a câmera, status, espaço livre e política de retenção, se houver.",
            vagueExamples: ["HD ok", "tem HD", "armazenamento normal"],
            nextAction: "NVR/DVR: abrir o menu de discos (o nome varia por modelo) e anotar status, capacidade total/livre e atribuição do canal. VMS: no servidor de gravação, conferir o armazenamento configurado para a câmera e o espaço livre do volume. NÃO formatar disco nem apagar gravações sem confirmar com o cliente que não há gravações a preservar."
        },
        {
            id: "CAM-07",
            title: "Outras câmeras estão gravando?",
            appliesTo: ["NVR_DVR", "VMS"],
            whyItMatters: "Se outras câmeras do mesmo gravador/servidor também não gravam, a causa provável é comum (armazenamento, serviço, rede). Se só uma, a causa provável é a câmera, o canal ou sua configuração.",
            evidenceRequired: "Quantas outras câmeras foram verificadas, quais gravam e quais não, e como foi verificado (busca de gravação recente, informando o período).",
            vagueExamples: ["as outras estão ok", "só essa"],
            nextAction: "Buscar gravação recente de pelo menos duas outras câmeras do mesmo gravador ou servidor e anotar o resultado de cada uma."
        },
        {
            id: "CAM-08",
            title: "Data e hora dos equipamentos",
            appliesTo: ["CAMERA_SD", "NVR_DVR", "VMS"],
            whyItMatters: "Com data, hora ou fuso errados, a gravação pode existir em outro horário e não ser encontrada na busca, ou a agenda de gravação pode não coincidir com o horário real. Hora do gravador e da câmera diferentes também confundem a análise.",
            evidenceRequired: "Data e hora exibidas por cada equipamento envolvido (câmera, gravador ou servidor), comparadas com a hora real, o fuso configurado e se há sincronização automática (NTP). Só 'hora ok' não conta.",
            vagueExamples: ["hora ok", "data certa", "horário normal"],
            nextAction: "Comparar a hora de cada equipamento com a hora real e anotar a diferença, o fuso e a sincronização. NÃO alterar a hora do gravador sem alinhar com o N2, porque isso pode afetar a indexação das gravações existentes."
        },
        {
            id: "CAM-09",
            title: "Modelo e firmware",
            appliesTo: ["CAMERA_SD", "NVR_DVR", "VMS"],
            whyItMatters: "Firmware ou software desatualizado ou incompatível entre câmera e gravador/VMS pode causar falha de gravação ou de comunicação. O N2 precisa da versão exata para comparar com as notas de versão do fabricante.",
            evidenceRequired: "Modelo e versão exata do firmware da câmera. Se a gravação é no NVR/DVR, também modelo e firmware do gravador. Se for VMS, a versão do software VMS (e do servidor de gravação, quando separado). Só 'firmware atualizado' não conta.",
            vagueExamples: ["firmware ok", "tá atualizado", "versão recente"],
            nextAction: "Anotar modelo e versão na interface da câmera (e do gravador ou do VMS, quando houver). NÃO atualizar firmware ou software como tentativa de correção sem alinhar com o N2 e seguir o procedimento do fabricante."
        }
    ]
}