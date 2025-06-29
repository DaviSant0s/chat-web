export const checkServer = async (url: string): Promise<void> => {

  const controller = new AbortController();

  // Se demorar um segundo para o servidor responder, 
  // a função controller.abort() será chamada automaticamente,
  // cancelando a requisição fetch através do signal.
  // Isso evita que o fetch fique "pendurado" indefinidamente.

  const timer = setTimeout(() => controller.abort(), 2000)

  try {
    
    await fetch(`${url}/`, { method: 'GET', signal: controller.signal });

  } finally {

    clearTimeout(timer);

  }
};