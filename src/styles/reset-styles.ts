import { css } from 'lit';
export const resetStyles = css`

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@400..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  font-family: 'Inter', sans-serif
}

body, html {
  margin: 0;
  padding: 0;
}

html {
  font-size: 100%;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  text-rendering: optimizeSpeed; 
}

img, picture, video, canvas, svg {
  max-width: 100%;
  display: block;
}

ul, ol {
  list-style: none;
}

a {
  color: inherit;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}


/* COLOR SCHEMA */



.valid {
  color: var(--color-success);
}
.invalid {
  color: var(--color-error);
}

/* FONT SIZES */

label {
  color: var(--color-secondary);
  font-weight: 400;
  font-family: 'Inter';
  margin-bottom: 0.25rem;
}

form {
  max-width: 480px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}



.form-group {
  display: flex;
  flex-direction: column;
}

input, input[type="text"] {
  width: 100%;
  padding: 1rem;
  border: 2px solid #DDDDDD;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-secondary);
  background-color: #DDDDDD;
}

input:focus {
  border: 2px solid var(--color-secondary);
  transition: all 200ms ease;
}

select {
  background-color: white;
  border: 2px solid #c6c5b9;
  border-radius: 0.25rem;
  font-size: 1rem;
}

button.primary, .button-link {
  color: #F2ECFF;
  background-color: var(--color-primary);
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-primary);
  border-radius: 0.25rem;
  font-family: 'DynaPuff', 'Inter';
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

button.secondary {
  color: #707070;
  background-color: #DDDDDD;
  width: 100%;
  padding: 1rem;
  border: 2px solid #DDDDDD;
  border-radius: 0.25rem;
  font-family: 'DynaPuff', 'Inter';
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}



.router-link {
  font-size: 0.875rem;
  text-align: center;
}


h1.logo {
  color: #6314ff; 
  font-family: DynaPuff; 
  font-size: 3rem;
  font-weight: 600; 
  text-align: center;
}


`;

